import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { SignJWT } from 'jose'
import nodemailer from 'nodemailer'
import 'dayjs/locale/ko' // 한국어 로케일 불러오기
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ko') // 한국어 로케일 설정

const SECRET_KEY = process.env.RESET_PW_JWT
const passwordUpdateRequestDate = dayjs().tz('Asia/Seoul')

if (!SECRET_KEY) {
  throw new Error('환경변수 RESET_PW_JWT 누락')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('req body =======>', body)

  if (!body.input_email) {
    return NextResponse.json({ status: 'fail', message: '이메일 전송에 실패했습니다. 다시 제출해주세요.' })
  }

  try {
    //존재하는 이메일인지 체크
    const response = await prisma.user.findUnique({
      where: {
        email: body.input_email,
      },
      select: {
        id: true,
      },
    })

    if (!response) {
      return NextResponse.json({ status: 'fail', message: '존재하지 않는 이메일입니다. 다시 제출해주세요.' })
    }

    //존재한다면 해당 이메일의 ID를 가져오기
    const userId = response.id

    // 비밀번호 재설정 JWT 토큰 생성
    const token = await new SignJWT({ input_email: body.input_email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(new TextEncoder().encode(SECRET_KEY))

    // JWT 토큰이 포함된 비밀번호 재설정 링크
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`
    console.log('resetLink =======>', resetLink)

    // Nodemailer 설정
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // 비밀번호 재설정 링크 이메일 전송
    await transporter.sendMail({
      from: `"Shopping" <${process.env.EMAIL_USER}>`,
      to: body.input_email,
      subject: '[Shopping] 비밀번호 갱신 메일입니다.',
      html: `
        <html lang="ko">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT-Variable.css" rel="stylesheet" />
            <title>비밀번호 갱신하기</title>
          </head>
          <body style="margin: 0; padding: 0">
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              align="center"
              style="font-family: 'SUIT Variable', sans-serif; margin: 0; padding: 5vh 0; background-color: #edcdcd; display: inline-block; width: 100%"
            >
              <tbody
                style="
                  width: 94%;
                  display: block;
                  max-width: 630px;
                  border-style: none;
                  box-sizing: border-box;
                  background-color: #ffffff;
                  border-radius: 16px;
                  padding: 5vh 25px;
                  margin: auto;
                "
              >
                <tr style="box-sizing: border-box; display: block; text-align: center">
                  <td style="margin: 0; display: inline-block">
                    <img
                      src="https://fluplmlpoyjvgxkldyfh.supabase.co/storage/v1/object/public/next-auth-test/images/email_template_image.webp"
                      width="100px"
                      style="aspect-ratio: 9/8; margin: 15px 15px 25px 15px; display: block"
                      alt="Shopping 비밀번호 찾기 이미지"
                    />
                  </td>
                  <td style="display: inline-block; width: fit-content; vertical-align: middle; text-align: left; margin-bottom: 25px">
                    <p style="font-size: 25px; font-weight: 700; letter-spacing: -1px; margin: 0">
                      <span style="font-size: 30px; letter-spacing: -1px; color: #B04A4A">Shopping</span>의
                    </p>
                    <p style="font-size: 25px; font-weight: 700; letter-spacing: -1px; margin: 0 0 8px 0">비밀번호를 재설정합니다.</p>
                    <p style="font-size: 14px; font-weight:400; margin: 0">[비밀번호 재설정 요청일시] ${dayjs(passwordUpdateRequestDate).format('YYYY년 MM월 DD일 A hh:mm:ss')}</p>
                  </td>
                </tr>
                <tr
                  style="
                    display: block;
                    padding: 25px 0;
                    border-bottom: 1px solid black;
                    border-top: 1px solid black;
                    max-width: 450px;
                    width: 100%;
                    margin: auto;
                  "
                >
                  <td>
                    <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 500; line-height: 24px">안녕하세요. Shopping팀입니다.</p>
                    <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 500; line-height: 24px">
                      지금 보고 계신 이메일을 받은 주소로 인증된 Shopping 아이디는 <br />
                      <span style="color: #B04A4A; font-weight: 700">${userId}</span> 입니다.
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 500; line-height: 24px">
                      비밀번호를 변경하시려면 하단의 버튼을 클릭하여 주세요. <br />
                      버튼은 발급 후 <span style="color: #B04A4A; font-weight: 700">15분</span> 유효합니다, 잊지말고 유효시간 내에 비밀번호를 변경 해 주시기 바랍니다.
                    </p>
                    <p style="width: 100%; margin: 0 0 20px 0; font-size: 16px; font-weight: 500; line-height: 24px">
                      <a
                        href="${resetLink}"
                        target="_blank"
                        style="
                          box-sizing: border-box;
                          text-decoration: none;
                          background-color: #B04A4A;
                          padding: 10px 20px;
                          border-radius: 8px;
                          display: block;
                          color: #ffffff;
                          width: 100%;
                          text-align: center;
                          font-weight: 700;
                        "
                        >비밀번호 변경하기</a
                      >
                    </p>
                    <p style="margin: 0; font-size: 16px; line-height: 24px; font-weight: 500">
                      본인이 비밀번호 변경을 요청하지 않은 경우 이 이메일을 삭제해 주시기 바랍니다. 감사합니다.
                    </p>
                  </td>
                </tr>
                <tr style="margin: 25px auto 25px auto; display: block; max-width: 450px; width: 100%">
                  <td>
                    <p style="font-size: 14px; margin: 0; line-height: 24px; color: #999999">
                      이 외에 더 궁금하신 점이나 서비스 이용 중 불편한 점이 있다면 <br />
                      <span style="font-size: 14px; color: skyblue">info@shopping.com</span>으로 문의해 주시기 바랍니다.
                    </p>
                  </td>
                </tr>
                <tr style="display: block; max-width: 450px; width: 100%; margin: auto">
                  <td style="font-size: 14px; color: #999999">Shopping Inc.</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ status: 'success', message: '비밀번호 갱신 이메일이 전송되었습니다.' })
  } catch (error) {
    return NextResponse.json({ status: 'fail', message: '비밀번호 갱신 이메일이 전송에 실패했습니다.' })
  }
}
