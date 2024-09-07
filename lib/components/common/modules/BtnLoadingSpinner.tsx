'use client'

export const BtnLoadingSpinner = () => {
  return (
    <div className="loader left-[50%] top-[-17px] translate-x-[-50%]">
      <style jsx>{`
        .loader,
        .loader:before,
        .loader:after {
          border-radius: 50%;
          width: 1.6em;
          height: 1.6em;
          animation-fill-mode: both;
          animation: bblFadInOut 1.8s infinite ease-in-out;
        }
        .loader {
          color: white;
          font-size: 7px;
          position: relative;
          text-indent: -9999em;
          transform: translateZ(0);
          animation-delay: -0.16s;
        }
        .loader:before,
        .loader:after {
          content: '';
          position: absolute;
          top: 0;
        }
        .loader:before {
          left: -3.5em;
          animation-delay: -0.32s;
        }
        .loader:after {
          left: 3.5em;
        }

        @keyframes bblFadInOut {
          0%,
          80%,
          100% {
            box-shadow: 0 2.5em 0 -1.3em;
            -webkit-box-shadow: 0 2.5em 0 -1.3em;
            -moz-box-shadow: 0 2.5em 0 -1.3em;
          }
          40% {
            box-shadow: 0 2.5em 0 0;
            -webkit-box-shadow: 0 2.5em 0 0;
            -moz-box-shadow: 0 2.5em 0 0;
          }
        }
      `}</style>
    </div>
  )
}
