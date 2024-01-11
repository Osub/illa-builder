import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { RegisterPage } from "@illa-public/sso-module"
import { RegisterFields } from "@illa-public/sso-module/RegisterPage/interface"
import { FC, useState } from "react"
import { SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useMessage } from "@illa-design/react"
import { fetchSignUp } from "@/services/auth"

export type RegisterErrorMsg = Record<keyof RegisterFields, string>

const UserRegister: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<RegisterErrorMsg>({
    email: "",
    password: "",
    nickname: "",
    verificationCode: "",
    isSubscribed: "",
  })

  const sendEmail = async () => {
    console.log(123)
  }

  const message = useMessage()
  const [searchParams] = useSearchParams()

  const onSubmit: SubmitHandler<RegisterFields> = async (data) => {
    setLoading(true)
    try {
      await fetchSignUp(data)

      message.success({
        content: t("page.user.sign_up.tips.success"),
      })

      navigate(
        `/${searchParams.toString() ? "?" + searchParams.toString() : ""}`,
      )
    } catch (e) {
      if (isILLAAPiError(e)) {
        switch (e?.data?.errorFlag) {
          case ERROR_FLAG.ERROR_FLAG_PASSWORD_INVALIED:
          case ERROR_FLAG.ERROR_FLAG_SIGN_UP_EMAIL_MISMATCH:
            message.error({
              content: t("page.user.sign_up.tips.fail_account"),
            })
            break
          default:
            message.error({
              content: t("page.user.sign_up.tips.fail"),
            })
            break
        }
        switch (e.data.errorMessage) {
          case "no such user":
            setErrorMsg({
              ...errorMsg,
              email: t("page.user.sign_in.error_message.email.registered"),
            })
            break
          case "invalid password":
            setErrorMsg({
              ...errorMsg,
              password: t("page.user.sign_in.error_message.password.incorrect"),
            })
            break
          default:
        }
      } else {
        message.warning({
          content: t("network_error"),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegisterPage
      sendEmail={sendEmail}
      loading={loading}
      errorMsg={errorMsg}
      onSubmit={onSubmit}
    />
  )
}

export default UserRegister
