import './Receipt.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config';

const Receipt = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const getOrderById = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`);
      console.log('API Response:', response.data);
      setOrder(response.data);
    } catch (error) {
      console.log('Error fetching order by ID', error);
    }
  };

  useEffect(() => {
    getOrderById();
    document.title = 'Receipt # ' + id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const { items, transaction } = order;
  const { overallTotal, transactionId, createdDate: date } = transaction;
  const totalItemCount = items.length;

  // Function to format a timestamp into a readable date string
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="receipt-container">
      <div className="logo-text">VERSATILY</div>
      <div className="receipt-head">
        <table>
          <thead>
            <tr>
              <th>QTY</th>
              <th>ITEM</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.quantity}x</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total">
        <table>
          <tbody>
            <tr>
              <th>Item Count: </th>
              <td>{totalItemCount}</td>
            </tr>
            <tr>
              <th>Total Price: </th>
              <td>{overallTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="receipt-footer">Thank you for your purchase!</div>
      <div className="receipt-number">Receipt #: {transactionId}</div>
      <span className="time">Date: {formatDate(date)}</span>
    </div>
  );
};

export default Receipt;
