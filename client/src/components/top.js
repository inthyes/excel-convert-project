import React from "react"
import { css } from "@emotion/react"
import "bootstrap/dist/css/bootstrap.min.css"

export function Top() {
  return (
    <div
      css={css`
        position: absolute;
        background-color: black;
        width: 100%;
        height: 300px;
        z-index: -9;
      `}
    >
      <h1
        css={css`
          padding-top: 48px;
          padding-bottom: 24px;
          color: white;
          text-align: center;
          font-size: 28px;
        `}
      >
        코로나19(COVID-19)
        <br />
        실시간 상황판
      </h1>
      <p
        css={css`
          color: white;
          text-align: center;
        `}
      >
        {/* 마지막 업데이트: {lastUpdatedFormatted} */}
      </p>
    </div>
  )
}
