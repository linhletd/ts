import * as yup from 'yup';

const UserLoginFormValidationSchema = yup.object({
  username: yup.string().required('Bắt buộc phải nhập tên đăng nhập').max(256, 'Tên đăng nhập không được dài quá 256 ký tự'),
  password: yup.string().required('Bắt buộc phải nhập mật khẩu'),
});

export default UserLoginFormValidationSchema;
