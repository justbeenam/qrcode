function removeVietnameseAccents(str: string) {
  // Chuẩn hóa chuỗi thành dạng NFD để phân tách ký tự và dấu
  str = str.normalize('NFD');

  // Loại bỏ các dấu
  str = str.replace(/[\u0300-\u036f]/g, '');

  // Chuyển các ký tự đặc biệt khác thành ký tự không dấu tương ứng
  str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');

  return str;
}
export default removeVietnameseAccents;
