'use client'

export const ProductList = (props: any) => {
  return (
    <table>
      <thead>
        <tr>
          <th>이름</th>
          <th>카테고리</th>
          <th>정가</th>
          <th>할인</th>
          <th>판매가</th>
          {/* <th>이미지 URL</th> */}
        </tr>
      </thead>
      <tbody>
        {props.data.map((item: any, index: number) => (
          <tr key={index}>
            <td>{item.name}</td>
            <th>{item.category}</th>
            <td>{item.original_price}</td>
            <td>{item.discount_rate}</td>
            <td>16,000</td>
            {/* <td>{item.imageUrl}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
