import React from 'react';
import Transaction from '../transaction';

export const HistoryWithdraw = () => {

    return (
        <>
            <h1>Lịch sử rút</h1>
            <Transaction dataType="RUTTIEN" />
        </>
    )
}


export default HistoryWithdraw;
