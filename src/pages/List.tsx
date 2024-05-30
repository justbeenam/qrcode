import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import QRCode from 'qrcode.react';
import CryptoJS from 'crypto-js';

import { Fragment, useEffect, useState } from 'react';
import { GoSearch } from 'react-icons/go';
import { IoIosCloseCircleOutline, IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';

import { formDataContent } from '~/configs/const';
import { db } from '~/configs/database';
import { useAuthContext } from '~/contexts/AuthContextProvider';
import { useLoadingContext } from '~/contexts/LoadingContextProvider';
import removeVietnameseAccents from '~/hooks/useRemoveVietNameseAccents';
import { toastError, toastSuccess } from '~/hooks/useToast';
import { addQrCode } from '~/services/formService';
import { logout } from '~/services/loginService';

function List() {
  const { currentUser } = useAuthContext();
  const { setLoading } = useLoadingContext();

  const [showManagerList, setShowManagerList] = useState(false);

  const [dataForms, setDataForm] = useState<formDataContent[]>([]);
  const [renderData, setRenderData] = useState<formDataContent[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const [userAdmin, setUserAdmin] = useState<any[]>([]);
  const [renderSearchUserData, setRenderSearchUserData] = useState<any[]>([]);
  const [searchValueUserAdmin, setSearchValueUserAdmin] = useState('');
  const [showResult, setShowResult] = useState(false);

  const [showQRCode, setShowQrCode] = useState<{ data: {}; show: boolean }>({ data: {}, show: false });

  // useEffect(() => {
  //   const queryUser = query(collection(db, 'users'));
  //   onSnapshot(queryUser, (data) => {
  //     if (!data.empty) {
  //       let user: any[] = [];
  //       data.forEach((va: any) => {
  //         user.push(va.data());
  //       });
  //       setUserAdmin(user);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if (searchValueUserAdmin !== '') {
  //     const filtered = userAdmin.filter((entry) =>
  //       Object.values(entry).some(
  //         (val) =>
  //           typeof val === 'string' &&
  //           removeVietnameseAccents(val)
  //             .toLocaleLowerCase()
  //             .includes(removeVietnameseAccents(searchValueUserAdmin).toLocaleLowerCase()),
  //       ),
  //     );
  //     setRenderSearchUserData(filtered);
  //     setShowResult(true);
  //   } else {
  //     setRenderSearchUserData([]);
  //   }
  // }, [searchValueUserAdmin, userAdmin]);

  useEffect(() => {
    let collectionForm;
    if (currentUser.email === import.meta.env.VITE_EMAIL_ADMIN) {
      collectionForm = query(collection(db, 'qrcodes'), orderBy('startDate', 'desc'));
    } else {
      collectionForm = query(
        collection(db, 'qrcodes'),
        where('dvvt', '==', currentUser.uid),
        orderBy('startDate', 'desc'),
      );
    }

    onSnapshot(collectionForm, (data) => {
      if (!data.empty) {
        let form: formDataContent[] = [];
        data.forEach((va: any) => {
          form.push(va.data());
        });
        setDataForm(form);
      }
    });
  }, [currentUser]);

  useEffect(() => {
    if (searchValue !== '') {
      const filtered = dataForms.filter((entry) =>
        Object.values(entry).some(
          (val) =>
            typeof val === 'string' &&
            removeVietnameseAccents(val)
              .toLocaleLowerCase()
              .includes(removeVietnameseAccents(searchValue).toLocaleLowerCase()),
        ),
      );
      console.log(filtered, searchValue);

      setRenderData(filtered);
    } else {
      setRenderData(dataForms);
    }
  }, [searchValue, dataForms]);

  const deleteQrCode = (so: any, phuhieu: any) => {
    if (confirm(`Xoá qrcode số phù hiệu ${phuhieu}?`)) {
      deleteDoc(doc(db, 'qrcodes', so))
        .then((_) => toastSuccess('Xoá thành công'))
        .catch((_) => toastError('Lỗi!'));
    } else {
    }
  };
  // const addManager = async (id: any) => {
  //   const nameCompany = prompt('Nhập tên công ty');
  //   if (nameCompany !== null) {
  //     setLoading(true);
  //     const docUser = doc(db, 'users', id);
  //     updateDoc(docUser, {
  //       role: 1,
  //       nameCompany,
  //     })
  //       .then((_) => {
  //         toastSuccess('Thêm thành công');
  //         setLoading(false);
  //       })
  //       .catch((_) => {
  //         toastError('Đã có lỗi xảy ra!');
  //         setLoading(false);
  //       });
  //   }
  // };
  // const deleteManager = async (id: any, email: any) => {
  //   if (confirm(`Xoá quản lý ${email}?`)) {
  //     setLoading(true);
  //     const docUser = doc(db, 'users', id);
  //     updateDoc(docUser, {
  //       role: 2,
  //     })
  //       .then((_) => {
  //         toastWarning('Xoá thành công');
  //         setLoading(false);
  //       })
  //       .catch((_) => {
  //         toastError('Đã có lỗi xảy ra!');
  //         setLoading(false);
  //       });
  //   } else {
  //   }
  // };

  const handleSubmitMakeQR = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const formData = {
      sph: event.target.sph.value,
      sgtvtc: event.target.sgtvtc.value,
      bsx: event.target.bsx.value,
      tdvkdvt: event.target.tdvkdvt.value,
      ndcph: event.target.ndcph.value,
      lph: event.target.lph.value,
      nhh: event.target.nhh.value,
      dvvt: currentUser.uid,
    };
    addQrCode(formData)
      .then((_) => {
        setLoading(false);
        event.target.sph.value = '';
        event.target.sgtvtc.value = '';
        event.target.tdvkdvt.value = '';
        event.target.bsx.value = '';
        event.target.lph.value = '';
        event.target.ndcph.value = '';
        event.target.nhh.value = '';
        toastSuccess('Tạo mã QR thành công');
        setShowQrCode({ data: formData, show: true });
      })
      .catch((v) => {
        console.log(v);

        setLoading(false);
        toastError('Có lỗi xảy ra!');
      });
  };

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
      <div className="absolute top-[20px] sm:top-[10px] px-[40px] sm:px-[10px] w-full flex justify-between ">
        <div className="flex items-center gap-8 sm:gap-1">
          {/* <Link
            to={config.routes.home}
            className="flex justify-center items-center p-[10px_40px] xs:text-sm xs:p-[2px_5px] sm:p-[5px_10px] bg-[#1B4242] text-white border-transparent border hover:border-[#1B4242] hover:bg-white hover:text-[#1B4242] rounded-md hover:shadow-lg"
          >
            Quay lại
            <i></i>
          </Link> */}
          {/* {currentUser.email === import.meta.env.VITE_EMAIL_ADMIN && ( */}
          <button
            className="flex justify-center items-center p-[10px_40px] xs:text-sm xs:p-[2px_5px] sm:p-[5px_10px] bg-[#6DC5D1] text-white border-transparent border hover:border-[#6DC5D1] hover:bg-white hover:text-[#6DC5D1] rounded-md hover:shadow-lg"
            onClick={() => setShowManagerList(true)}
          >
            Thêm mã QR
            <i></i>
          </button>
          {/* )} */}
        </div>
        <button
          className="flex justify-center items-center p-[10px_40px] xs:text-sm xs:p-[2px_5px] sm:p-[5px_10px] bg-[#EE4266] text-white border-transparent border hover:border-[#EE4266] hover:bg-white hover:text-[#EE4266] rounded-md hover:shadow-lg"
          onClick={async () => await logout()}
        >
          Đăng xuất
        </button>
      </div>
      <div className="sm:text-[16px] mt-[80px] font-bold text-[#7469B6] text-[25px] mb-[10px] text-ellipsis whitespace-nowrap overflow-hidden flex items-center justify-center ">
        Xin chào, {currentUser.nameCompany}
      </div>
      <div className="sm:text-[16px] mt-[10px] font-bold text-[#6a64f1] text-[25px] mb-[20px] text-ellipsis whitespace-nowrap overflow-hidden flex items-center justify-center ">
        Danh sách các mã QR
      </div>
      <div className="w-full h-full flex flex-col items-center overflow-hidden">
        <div className="w-4/5 md:w-full sm:w-full flex items-center flex-col">
          <div className="w-full flex items-center justify-end relative mb-[5px] sm:px-[5px]">
            <div className=" sm:w-full bg-[#6b64f142] rounded-[8px] mb-[10px] flex items-center px-[10px]">
              <GoSearch className="text-[20px]" />
              <input
                className="bg-transparent p-[10px] focus:outline-none w-full h-full"
                placeholder="Tìm kiếm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <IoIosCloseCircleOutline
                className={`text-[20px] cursor-pointer ${searchValue.length > 0 ? 'visible' : 'invisible'}`}
                onClick={() => setSearchValue('')}
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh_/_1.3)]">
            <table>
              <thead>
                <tr>
                  <th scope="col">Số phù hiệu</th>
                  <th scope="col">Biển số xe</th>
                  <th scope="col">Ngày hết hạn</th>
                  <th scope="col">Trạng thái phù hiệu</th>
                  <th scope="col">Ngày tạo</th>
                  <th scope="col">QR code</th>
                </tr>
              </thead>
              <tbody>
                {renderData.length > 0 &&
                  renderData.map((data: any, index) => (
                    <tr key={index} className="border-b border-neutral-200 sm:flex sm:flex-col ">
                      <td data-label="Số phù hiệu" scope="row" className="font-medium ">
                        {data.sph}
                      </td>

                      <td data-label="Biển số xe" className="text-ellipsis overflow-hidden">
                        {data.bsx}
                      </td>
                      <td data-label="Ngày hết hạn" className="text-ellipsis overflow-hidden">
                        {new Date(data.nhh).toLocaleDateString()}
                      </td>
                      <td
                        data-label="Trạng thái phù hiệu"
                        className={new Date(data.nhh) > new Date() ? 'text-green-600' : 'text-red-600'}
                      >
                        {new Date(data.nhh) > new Date() ? 'Còn hiệu lực' : ' Hết hiệu lực'}
                      </td>
                      <td data-label="Ngày tạo">{new Date(data.startDate).toLocaleDateString()}</td>
                      <td data-label="QR Code" className="flex gap-2">
                        <Link
                          to={`/viewqr/${encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_KEY_HASH).toString())}`}
                          className="button-19 sm:p-[8px_10px] sm:text-[14px]"
                          role="button"
                          state={'Preview'}
                        >
                          QR Code
                        </Link>
                        {/* {currentUser.email === import.meta.env.VITE_EMAIL_ADMIN && ( */}
                        <button
                          className="flex justify-center items-center p-[13px_16px]  bg-[#EE4266] text-white border-transparent border hover:border-[#EE4266] hover:bg-white hover:text-[#EE4266] rounded-md hover:shadow-lg  sm:p-[8px_10px] sm:text-[14px]"
                          role="button"
                          onClick={() => deleteQrCode(data.id, data.sph)}
                        >
                          Delete
                        </button>
                        {/* )} */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showManagerList === true && (
        <div className="fixed z-[99] top-0 left-0 w-screen h-screen bg-[#0000006b] flex justify-center items-center">
          <div className="w-[calc(100vw_/_1.2)] h-[calc(100vh_/_1.2)] sm:w-[95%] bg-white rounded-md">
            <div className="relative w-full h-full flex flex-col p-[20px]">
              <div className="absolute top-[10px] right-[10px]">
                <button
                  className="outline-none border border-[#f25c66] rounded-full p-[5px] hover:text-white hover:bg-[#f25c66] text-[#f25c66]"
                  onClick={() => {
                    setShowManagerList(false);
                    setShowQrCode({ data: {}, show: false });
                  }}
                >
                  <IoMdClose className=" text-[30px] sm:text-[20px]" />
                </button>
              </div>
              {/* <div className="flex-[0.3] flex flex-col"> */}
              <p className="text-center text-[#6a64f1] text-[22px] sm:text-[14px] mb-[10px]">Tạo mã QR</p>
              {/* <p className="text-center text-[#6a64f1] text-[22px] sm:text-[14px]">Danh sách quản lý</p>
                <div className="w-full flex justify-center h-[40px] mt-[20px]">
                  <TippyHeadless
                    interactive
                    visible={showResult && searchValueUserAdmin.length > 0}
                    onClickOutside={() => setShowResult(false)}
                    placement="bottom"
                    render={(attrs) => (
                      <div
                        className="w-[calc(100vw_/_2.5)] sm:w-[calc(100vw_/_1.1)] max-h-[calc(100vh_/_2.5)] overflow-auto bg-slate-200 rounded-md shadow-md"
                        tabIndex={-1}
                        {...attrs}
                      >
                        {renderSearchUserData.map(
                          (user) =>
                            user.uid !== currentUser.uid && (
                              <div key={user.uid} className="p-[10px] flex items-center justify-between">
                                <div className=" overflow-hidden rounded-full ">
                                  <img
                                    className="w-[40px] h-[40px] object-cover"
                                    src={user.photoURL ? user.photoURL : undefined}
                                    alt="avatar"
                                  />
                                </div>
                                <div className="flex-1 flex flex-col px-[10px] overflow-hidden whitespace-nowrap ">
                                  <div className="overflow-hidden text-ellipsis font-medium sm:text-[14px]">
                                    {user.displayName}
                                  </div>
                                  <div className="overflow-hidden text-ellipsis text-[14px] sm:text-[13px]">
                                    {user.email}
                                  </div>
                                </div>
                                {user.role !== 1 && (
                                  <Tippy content="Thêm người này thành quản lý">
                                    <button className="text-green-700 text-[30px]" onClick={() => addManager(user.uid)}>
                                      <IoMdAddCircleOutline />
                                    </button>
                                  </Tippy>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    )}
                  >
                    <div className="bg-[#577B8D] h-full w-1/2 rounded-lg sm:w-full  flex items-center px-[10px] text-white">
                      <GoSearch className="text-[20px]" />
                      <input
                        className="bg-transparent p-[10px] focus:outline-none w-full h-full placeholder:text-white"
                        placeholder="Tìm kiếm"
                        value={searchValueUserAdmin}
                        onFocus={() => setShowResult(true)}
                        onChange={(e) => setSearchValueUserAdmin(e.currentTarget.value)}
                        autoFocus={false}
                      />
                      <IoIosCloseCircleOutline
                        className={`text-[20px] cursor-pointer ${searchValueUserAdmin.length > 0 ? 'visible' : 'invisible'}`}
                        onClick={() => setSearchValueUserAdmin('')}
                      />
                    </div>
                  </TippyHeadless>
                </div> */}
              {/* </div> */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center items-start">
                {showQRCode.show ? (
                  <div className="flex flex-col gap-10">
                    <QRCode
                      value={`${window.location.origin}/viewqr/${encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(showQRCode.data), import.meta.env.VITE_KEY_HASH).toString())}`}
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
                    <button
                      className="flex justify-center items-center p-[10px_40px] xs:text-sm xs:p-[2px_5px] sm:p-[5px_10px] bg-[#4769a8] text-white border-transparent border hover:border-[#4769a8] hover:bg-white hover:text-[#4769a8] rounded-md hover:shadow-lg"
                      onClick={() => setShowQrCode({ data: {}, show: false })}
                    >
                      Tạo thêm mã QR
                    </button>
                  </div>
                ) : (
                  <div className="formbold-main-wrapper w-full ">
                    <div className="formbold-form-wrapper w-full sm:!p-0">
                      <form method="POST" onSubmit={handleSubmitMakeQR}>
                        <div className="formbold-input-wrapp formbold-mb-3">
                          <label htmlFor="sph" className="formbold-form-label">
                            Số phù hiệu:
                          </label>
                          <div className="sm:flex-col">
                            <input
                              type="text"
                              name="sph"
                              id="sph"
                              placeholder="Số phù hiệu"
                              className="formbold-form-input sm:placeholder:text-[14px]"
                            />
                          </div>
                        </div>
                        <div className="formbold-input-wrapp formbold-mb-3">
                          <label htmlFor="sgtvtc" className="formbold-form-label">
                            Sở giao thông vận tải cấp:
                          </label>
                          <div>
                            <input
                              type="text"
                              name="sgtvtc"
                              id="sgtvtc"
                              placeholder="Sở giao thông vận tải cấp"
                              className="formbold-form-input sm:placeholder:text-[14px]"
                            />
                          </div>
                        </div>
                        <div className="formbold-input-wrapp formbold-mb-3">
                          <label htmlFor="tdvkdvt" className="formbold-form-label">
                            Tên đơn vị KDVT:
                          </label>
                          <div>
                            <input
                              type="text"
                              name="tdvkdvt"
                              id="tdvkdvt"
                              placeholder="Tên đơn vị KDVT"
                              className="formbold-form-input sm:placeholder:text-[14px]"
                            />
                          </div>
                        </div>
                        <div className="formbold-input-wrapp formbold-mb-3">
                          <label htmlFor="ndcph" className="formbold-form-label">
                            Người duyệt cấp phù hiệu:
                          </label>
                          <div>
                            <input
                              type="text"
                              name="ndcph"
                              id="ndcph"
                              placeholder="Người duyệt cấp phù hiệu"
                              className="formbold-form-input sm:placeholder:text-[14px]"
                            />
                          </div>
                        </div>
                        <div className="formbold-input-wrapp formbold-mb-3">
                          <label htmlFor="bsx" className="formbold-form-label">
                            Biển số xe:
                          </label>
                          <div>
                            <input
                              type="text"
                              name="bsx"
                              id="bsx"
                              placeholder="Biển số xe"
                              className="formbold-form-input sm:placeholder:text-[14px]"
                            />
                          </div>
                        </div>
                        <div className="formbold-input-wrapp formbold-mb-3">
                          <label htmlFor="lph" className="formbold-form-label">
                            Loại phù hiệu:
                          </label>
                          <div>
                            <input
                              type="text"
                              name="lph"
                              id="lph"
                              placeholder="Loại phù hiệu"
                              className="formbold-form-input sm:placeholder:text-[14px]"
                            />
                          </div>
                        </div>
                        <div className="formbold-input-wrapp formbold-mb-3">
                          <label htmlFor="nhh" className="formbold-form-label">
                            Ngày hết hạn:
                          </label>
                          <div>
                            <input
                              type="date"
                              name="nhh"
                              id="nhh"
                              placeholder="Ngày hết hạn"
                              className="formbold-form-input sm:placeholder:text-[14px]"
                            />
                          </div>
                        </div>
                        {/* <div className="formbold-input-wrapp formbold-mb-3">
                        <label htmlFor="status" className="formbold-form-label">
                          Trạng thái Phù hiệu:
                        </label>
                        <div>
                          <input
                            type="date"
                            name="status"
                            id="status"
                            placeholder="Trạng thái Phù hiệu"
                            className="formbold-form-input sm:placeholder:text-[14px]"
                          />
                        </div>
                      </div> */}
                        <button className="formbold-btn">Tạo mã QR Code</button>
                      </form>
                    </div>
                  </div>
                )}

                {/* <div className="w-2/3 sm:w-full">
                  {userAdmin
                    .filter((u) => u.role === 1 && u.uid !== currentUser.uid)
                    .map((v) => (
                      <div key={v.uid} className="p-[10px] flex items-center justify-between">
                        <div className=" overflow-hidden rounded-full ">
                          <img
                            className="w-[40px] h-[40px] object-cover"
                            src={v.photoURL ? v.photoURL : undefined}
                            alt="avatar"
                          />
                        </div>
                        <div className="flex-1 flex flex-col px-[10px] overflow-hidden whitespace-nowrap ">
                          <div className="font-medium overflow-hidden text-ellipsis  sm:text-[14px]">
                            {v.nameCompany}
                          </div>

                          <div className="overflow-hidden text-ellipsis text-[14px] sm:text-[13px]">{v.email}</div>
                        </div>

                        <Tippy content="Xoá người này ra khỏi quản lý">
                          <button className="text-red-700 text-[30px]" onClick={() => deleteManager(v.uid, v.email)}>
                            <IoMdCloseCircleOutline />
                          </button>
                        </Tippy>
                      </div>
                    ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default List;
