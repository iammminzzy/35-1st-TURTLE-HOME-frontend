import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailSize from '../../components/detailSize/detailSize';
import './ProductDetail.scss';

const ProductDetail = () => {
  const [data, setData] = useState({});

  const params = useParams();

  useEffect(() => {
    fetch('./data/detail.json')
      // fetch(`http://10.58.7.243:8000/products/${params.id}`)
      .then(response => response.json())
      .then(data => setData(data.result));
  }, []);
  // }, [params.id]);

  const addCommaToPrice = price => {
    return price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  };
  const [minPrice, maxPrice] = [
    data.description && addCommaToPrice(data.options[0].price),
    data.description &&
      addCommaToPrice(data.options[data.options.length - 1].price),
  ];

  const [selectedComponentNumber, setSelectedComponentNumber] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNumber, setTotalNumber] = useState(0);

  const token = localStorage.getItem('token');

  const cartFetch = () => {
    fetch(`http://10.58.4.113:8000/carts/cart`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        product_option_id: params.id,
        quantity: totalNumber,
      }),
    })
      .then(response => response.json())
      .then(result => console.log('결과: ', result));
  };

  return (
    <div className="product-detail">
      <img src={`${data.image_url}`} className="left-section" alt="detail" />
      <div className="right-section">
        <div className="detail-header">
          <div className="product-title">{data && data.name}</div>
          <div className="product-price">
            <span className="min-price">{minPrice} 원</span>
            <span> - </span>
            <span className="max-price">{maxPrice} 원</span>
          </div>
          <div className="product-id">제품번호 {data && data.number}</div>
          <div className="product-description">{data && data.description}</div>
        </div>
        <div className="detail-main">
          <div className="size-title">사이즈</div>
          <hr></hr>
          {data.description &&
            data.options.map((element, i) => {
              return (
                <DetailSize
                  key={i}
                  index={i}
                  size={element.size}
                  price={element.price}
                  selectedComponentNumber={selectedComponentNumber}
                  setSelectedComponentNumber={setSelectedComponentNumber}
                  setTotalNumber={setTotalNumber}
                  setTotalPrice={setTotalPrice}
                  addCommaToPrice={addCommaToPrice}
                />
              );
            })}
          <hr></hr>
        </div>
        <div className="detail-footer">
          <button className="put-shopping-basket" onClick={cartFetch}>
            장바구니에 담기 ({totalPrice}원)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
