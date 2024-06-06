import React from 'react';
import Transaction from '../transaction';

export const HistoryDeposit = () => {

    return (
        <>
            <h1>Lịch sử nạp</h1>
            <Transaction dataType="NAPTIEN" />
        </>
    )
}


export default HistoryDeposit;
