import React from 'react';

const OrderDetail = ({ order }) => {
  const isUpDirection = order.direction.includes('Up');
  const isWin =
    (isUpDirection && order.closeOutPrice > order.orderPrice) || 
    (!isUpDirection && order.closeOutPrice < order.orderPrice);

  const currentValue = isWin ? order.investment + (order.profitPercentage / 100) * order.investment : 0;

  return (
    <div className="grid grid-cols-1 gap-4 mb-3 p-6 rounded-lg shadow-lg bg-white">
      {/* Order details */}
      <div className="flex justify-between border-b border-t border-gray-300 py-2">
        <div>
          <p className="text-base font-bold text-gray-800">{order.symbol}</p>
        </div>
        <div>
          <p className="text-gray-400 text-[12px]">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Middle Row: Investment, Direction, and Duration */}
      <div className="flex justify-around text-sm">
        <div className="text-center">
          <p className="font-semibold text-gray-700">Investment:</p>
          <p>{order.investment}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-700">Direction:</p>
          <p className={`font-bold ${isUpDirection ? 'text-green-500' : 'text-red-500'}`}>
            {isUpDirection ? 'Up' : 'Down'}
          </p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-700">Income:</p>
          <p>{order.profitPercentage}%</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-700">Duration:</p>
          <p>{order.duration}</p>
        </div>
      </div>

      {/* Bottom Row: Buy Price with Gray Background */}
      <div className="space-y-2 bg-gray-200 text-[12px] p-4 rounded-lg">
        <div className="flex justify-between">
          <p className="tracking-wider font-bold text-black">Buy Price:</p>
          <p>{order.orderPrice}</p>
        </div>
        {order.status === 'closeout' && (
          <>
            <div className="flex justify-between">
              <p className="tracking-wider font-bold text-black">Closeout Price:</p>
              <p>{order.closeOutPrice}</p>
            </div>
            <div className="flex justify-between">
              <p className="tracking-wider font-bold text-black">Current Value:</p>
              <p className={`font-bold ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                {currentValue}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="tracking-wider font-bold text-black">Result:</p>
              <p className={`font-bold ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                {isWin ? 'Win' : 'Loss'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
