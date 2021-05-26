import * as yup from 'yup';
const ChangePasswordValidationSchema = yup.object({
  old_password: yup.string().required('Mật khẩu hiện tại là bắt buộc'),
  new_password: yup.string().required('Mật khẩu mới là bắt buộc'),
});
export default ChangePasswordValidationSchema;
