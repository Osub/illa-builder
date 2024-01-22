import {
  authCloudRequest,
  notNeedAuthCloudRequest,
} from "@illa-public/illa-net"
import { CurrentUserInfo } from "@illa-public/public-types"

interface SignInRequestBody {
  email: string
  password: string
}

interface SignUpRequestBody {
  inviteToken: any
  nickname: string
  email: string
  password: string
  verificationToken: string
  language: any
}

export const fetchSignIn = (data?: SignInRequestBody) => {
  return notNeedAuthCloudRequest<CurrentUserInfo>({
    url: "/auth/signin",
    method: "POST",
    data,
  })
}

export const fetchLogout = async (token: string) => {
  return await authCloudRequest({
    method: "POST",
    url: "/users/logout",
    headers: {
      Authorization: token,
    },
  })
}

export const fetchSignUp = (data?: SignUpRequestBody) => {
  return notNeedAuthCloudRequest<CurrentUserInfo>({
    url: "/auth/signup",
    method: "POST",
    data,
  })
}

interface forgetPasswordRequestBody {
  email: string
  verificationToken: string
  newPassword: string
}
export const fetchUpdatePasswordFromForgot = (
  data: forgetPasswordRequestBody,
) => {
  return authCloudRequest({
    method: "POST",
    url: "/auth/forgetPassword",
    data,
  })
}
