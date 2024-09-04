module.exports = {
  siteUrl: process.env.SITE_URL || process.env.NEXTAUTH_URL,
  generateRobotsTxt: true, // robots.txt 파일도 생성
  sitemapSize: 7000, // 한 사이트맵 파일당 최대 URL 수
  outDir: './public', // 사이트맵이 저장될 디렉터리
}
