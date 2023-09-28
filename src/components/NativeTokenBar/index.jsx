
import React, { useEffect, useState } from 'react';
import Ticker from 'react-ticker';
import { Sparklines, SparklinesLine } from 'react-sparklines';
// import increaseIcon from '/images/arrow5.svg';
// import decreaseIcon from '/images/arrow6.svg';
import { getCoinsBySymbols } from 'services/rapidService';

const css = `
.tokenTypeBar .itemSet {
  margin: 0 5px !important;
  gap: 10px;
}
. tokenTypeBar .item {
  background: #000000;
  border-radius: 10px;
  padding: 12px;
  height: 85px;
  width: 265px;
}
.tokenTypeBar .coin-icon {
  width: 25px;
  height: 25px
}
.tokenTypeBar .chart {
  width: 75px;
  height: 35px;
}
.tokenTypeBar .changeIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding: 5px;
}
.font-14 {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.02em;
  color: #E2E2E4;
}
.font-14 span {
  font-size: 14px;
  line-height: 14px;
}
.font-10 {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 13px;
  color: #ffffff;
}
.font-18 {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
}
.changeIcon-increase {
  background: rgba(26, 213, 152, 0.2);
}
.changeIcon-decrease {
  background: rgba(234, 58, 61, 0.2);
}
.changeIcon-bg1 {
  background: rgba(26, 213, 152, 0.2);
}
.tokenTypeBar .changeIcon img {
  width: 100%;
}
.color10 {
  color: #f93232 !important;
}
.color3 {
  color: #1AD598 !important;
}
`

const NativeTokenBar = () => {
  const [nativeTokenData, setNativeTokenData] = useState();

  useEffect(() => {
    let active = true
    const coinNames = [
      'BTC',
      'BNB',
      'ETH',
      'XRP',
      'MATIC',
      'ADA',
      'LINK',
      'AVAX',
      'CORE',
      'CRO',
      'FTM',
      'DOGE',
    ]
    const init = async () => {
      if (active) {
        const res = await getCoinsBySymbols(coinNames)
        setNativeTokenData(res.data.data.coins)
      }
    }
    init()
    return () => { active = false }
  }, [])

  return (
    <div>
      <style>
        {css}
      </style>
      <div className="tokenTypeBar mt-3" style={{background: "#000000"}}>
        {nativeTokenData && <Ticker height="45">
          {({ index }) => (
            <div className='d-flex itemSet' style={{ display: "flex", justifyContent: "space-between" }}>
              {
                nativeTokenData.map((item, i) => (
                  <div key={index} className="d-flex justify-content-between item" style={{ display: "flex", justifyContent: "center", width: "140px", margin: "5px", background: "#000000", borderRadius: "8px", padding: "5px" }}>
                    <div className="d-flex flex-column align-items-center" style={{ display: "flex", flexDirection: "column", width: "25px" }}>
                      <img className="coin-icon mb-1" src={item.iconUrl} alt='coin icon' />
                      {/* <div className="font-14 fw-bold">{item.symbol}</div> */}
                    </div>
                    {/* <Sparklines 
                    data={item.sparkline}
                    width={50} 
                    height={30} 
                    margin={5}
                  >
                    <SparklinesLine color={ item.change.includes('-')? "#EA3A3D": "#1AD598" } />
                  </Sparklines> */}
                    <div className="d-flex flex-column align-items-start justify-content-center" style={{ width: "80px", display: "flex", flexDirection: "column", justifyContent: "end" }}>
                      {/* <div className="font-18 text-white">
                      ${(parseFloat(item.price*item.change/100)).toFixed(2)}
                    </div> */}
                      <div className="font-10" style={{display: "flex", justifyContent: "right"}}>${parseFloat(item.price).toFixed(2)}</div>
                      <div style={{ display: "flex", justifyContent: "right" }}>
                        <div className={item.change.includes('-') === false ? "changeIcon changeIcon-increase" : "changeIcon changeIcon-decrease"} >
                          <img src={item.change.includes('-') === false ? "/images/arrow5.svg" : "/images/arrow6.svg"} alt='icon' />
                        </div>
                        {
                          item.change.includes('-') ?
                            <div className="font-14 color10 ms-1" style={{marginTop: "3px"}}>{item.change} %</div>
                            :
                            <div className="font-14 color3 ms-1" style={{marginTop: "3px"}}>+{item.change} %</div>
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </Ticker>}
      </div>
    </div>
  )
}
export default NativeTokenBar