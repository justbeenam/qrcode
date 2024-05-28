import { useLayoutEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

import CryptoJS from 'crypto-js';
import { toastError } from '~/hooks/useToast';
import QRCode from 'qrcode.react';
import config from '~/configs';
function Preview() {
  const { idQRCode } = useParams();
  const { state } = useLocation();

  const [data, setData] = useState<any>({});

  useLayoutEffect(() => {
    if (idQRCode && Object.keys(data).length === 0) {
      const deHash = CryptoJS.AES.decrypt(idQRCode, import.meta.env.VITE_KEY_HASH);
      const objectdata = CryptoJS.enc.Utf8.stringify(deHash);

      if (deHash) {
        setData(JSON.parse(objectdata));
      } else {
        toastError('Lỗi!');
      }
    }
  }, [idQRCode]);

  const handleDownLoadQR = () => {
    const abc: any = document.getElementById('canvas');
    const link: any = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = abc.toDataURL();
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Fragment>
      <div className="preview-page mt-[10px]">
        {state === 'Preview' && Object.keys(data).length > 0 && (
          <>
            <Link
              to={config.routes.home}
              className="absolute left-2 flex justify-center items-center p-[10px_40px] xs:text-sm xs:p-[2px_5px] sm:p-[5px_10px] bg-[#1B4242] text-white border-transparent border hover:border-[#1B4242] hover:bg-white hover:text-[#1B4242] rounded-md hover:shadow-lg"
            >
              Quay lại
              <i></i>
            </Link>
            <div className="flex w-full justify-center mb-[30px] ">
              <div className="flex flex-col gap-10 sm:mt-[40px]">
                <QRCode
                  value={`${window.location.origin}/viewqr/${encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_KEY_HASH).toString())}`}
                  renderAs="canvas"
                  size={300}
                  id="canvas"
                />
                <button
                  className="flex justify-center items-center p-[10px_40px] xs:text-sm xs:p-[2px_5px] sm:p-[5px_10px] bg-[#5eb65b] text-white border-transparent border hover:border-[#5eb65b] hover:bg-white hover:text-[#5eb65b] rounded-md hover:shadow-lg"
                  onClick={handleDownLoadQR}
                >
                  Tải xuống
                </button>
              </div>
            </div>
          </>
        )}
        <center className="flex flex-col gap-2 sm:text-[15px]">
          <p>
            Số phù hiệu: <span className="ml-[5px]">{data.sph}</span>
          </p>
          <p>
            Sở GTVT cấp: <span className="ml-[5px]">{data.sgtvtc}</span>
          </p>
          <p>
            Tên đơn vị KDVT: <span className="uppercase ml-[5px]">{data.tdvkdvt}</span>
          </p>
          <p>
            Người duyệt cấp phù hiệu: <span className="ml-[5px]">{data.ndcph}</span>
          </p>
          <p>
            Biển số xe: <span className="ml-[5px]">{data.bsx}</span>
          </p>
          <p>
            Loại phù hiệu: <span className="ml-[5px]">{data.lph}</span>
          </p>
          <p>
            Ngày hết hạn: <span className="ml-[5px]">{new Date(data.nhh).toLocaleDateString()}</span>
          </p>
          <p>
            Trạng thái Phù hiệu:
            <span className={`ml-[5px] ${new Date(data.nhh) > new Date() ? 'text-green-600' : 'text-red-600'}`}>
              {new Date(data.nhh) > new Date() ? 'Còn hiệu lực' : ' Hết hiệu lực'}
            </span>
          </p>
        </center>
      </div>
    </Fragment>
  );
}

export default Preview;
