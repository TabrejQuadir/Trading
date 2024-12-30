// client/src/components/CurrencyChart.js
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

function CurrencyChart({ symbol, interval = '1h' }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candlestickSeriesRef = useRef();
  const volumeSeriesRef = useRef();

  useEffect(() => {
    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
      timeScale: {
        borderColor: '#2B2B43',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

     // Create volume series with smaller bars
     const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.1, // Adjust to make volume bars smaller
        bottom: 0,
      },
      borderVisible: false,
      crossHairMarkerVisible: false,
    });

    // Store refs
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Fetch and update data
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`
        );
        const data = await response.json();

        const candleData = data.map((d) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));

        const volumeData = data.map((d) => ({
          time: d[0] / 1000,
          value: parseFloat(d[5]),
          color: parseFloat(d[4]) >= parseFloat(d[1]) ? '#26a69a' : '#ef5350',
        }));

        candlestickSeries.setData(candleData);
        volumeSeries.setData(volumeData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();

    // Set up WebSocket for real-time updates
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const candle = data.k;

      const candleData = {
        time: candle.t / 1000,
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c),
      };

      const volumeData = {
        time: candle.t / 1000,
        value: parseFloat(candle.v),
        color: parseFloat(candle.c) >= parseFloat(candle.o) ? '#26a69a' : '#ef5350',
      };

      candlestickSeries.update(candleData);
      volumeSeries.update(volumeData);
    };

    // Handle resize
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      ws.close();
      chart.remove();
    };
  }, [symbol, interval]);

  return (
    <div className="w-full h-full bg-[#1a1a1a] p-4 border border-gray-700">
      <div ref={chartContainerRef} className="w-full h-[100%]" />
    </div>
  );
}

export default CurrencyChart;
