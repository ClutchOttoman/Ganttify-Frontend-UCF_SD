import React from 'react';
import { useParams } from 'react-router-dom';
import ConfirmDelete from '../components/ConfirmDelete';

const ConfirmDeletePage = () => {
  const { userId, token } = useParams();

  return (
    <div>
      <ConfirmDelete userId={userId} token={token} />
    </div>
  );
};

export default ConfirmDeletePage;
