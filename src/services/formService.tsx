import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '~/configs/database';

export const addForm = async (form: any) => {
  const formCollect = doc(db, 'forms', form.so);
  try {
    await setDoc(formCollect, form);
  } catch (error) {
    console.error(error);
  }
};
export const addQrCode = async (form: any) => {
  const qrDoc = doc(collection(db, 'qrcodes'));
  try {
    await setDoc(qrDoc, {
      sph: form.sph,
      sgtvtc: form.sgtvtc,
      bsx: form.bsx,
      tdvkdvt: form.tdvkdvt,
      ndcph: form.ndcph,
      lph: form.lph,
      nhh: form.nhh,
      startDate: Date.now(),
      dvvt: form.dvvt,
      id: qrDoc.id,
    });
  } catch (error) {
    console.error(error);
  }
};
