// import { FC, useCallback, useEffect, useRef, useState } from "react"
import { ConnectButton, Connector } from "@ant-design/web3"
import {
  MetaMask,
  Polygon,
  WagmiWeb3ConfigProvider,
  WalletConnect,
} from "@ant-design/web3-wagmi"
import { FC } from "react"
import { createConfig, http } from "wagmi"
import { mainnet, polygon } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"
// import { RequestOptions, UploadItem } from "@illa-design/react"
import { AutoHeightContainer } from "@/widgetLibrary/PublicSector/AutoHeightContainer"
import { InvalidMessage } from "@/widgetLibrary/PublicSector/InvalidMessage"
// import { handleValidateCheck } from "@/widgetLibrary/PublicSector/InvalidMessage/utils"
import { TooltipWrapper } from "@/widgetLibrary/PublicSector/TooltipWrapper"
import { applyValidateMessageWrapperStyle } from "@/widgetLibrary/PublicSector/TransformWidgetWrapper/style"
import { uploadLayoutStyle } from "@/widgetLibrary/UploadWidget/style"
import { UploadWidgetProps } from "./interface"

const config = createConfig({
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      showQrModal: false,
      projectId: "8a713f1441b34f259026aca1736403d0",
    }),
  ],
})

export const WrappedConnectWallet: FC = (props) => {
  const {
    // selectionType,
    // type,
    // displayName,
    // showFileList,
    // disabled,
    // fileType = [],
    // loading,
    // buttonText,
    // dropText,
    // colorScheme,
    // variant,
    // parseValue,
    // fileList,
    // onRemove,
    // onChange,
    // getValidateMessage,
    // handleUpdateMultiExecutionResult,
    // customRequest,
  } = props

  //const isDrag = type === "dropzone"
  //const inputAcceptType = fileType.join(",")

  // const [chain, setChain] = useState<Chain>(Polygon);
  return (
    <WagmiWeb3ConfigProvider
      wallets={[MetaMask(), WalletConnect()]}
      chains={[Polygon]}
      config={config}
    >
      <Connector>
        <ConnectButton />
      </Connector>
    </WagmiWeb3ConfigProvider>
  )
}
WrappedConnectWallet.displayName = "WrappedConnectWallet"

export const ConnectWalletWidget: FC<UploadWidgetProps> = (props) => {
  const {
    // appendFiles,
    // customRule,
    tooltipText,
    // required,
    // minFiles,
    // maxFiles,
    // sizeType,
    // maxSize,
    // currentList,
    // value,
    // files,
    // minSize,
    validateMessage,
    // triggerEventHandler,
    // hideValidationMessage,
    updateComponentHeight,
    // handleUpdateDsl,
    // updateComponentRuntimeProps,
    // deleteComponentRuntimeProps,
  } = props

  return (
    <AutoHeightContainer
      updateComponentHeight={updateComponentHeight}
      enable={true}
    >
      <TooltipWrapper tooltipText={tooltipText} tooltipDisabled={!tooltipText}>
        <div css={uploadLayoutStyle}>
          <WrappedConnectWallet />
        </div>
      </TooltipWrapper>
      <div css={applyValidateMessageWrapperStyle(0, "left", true)}>
        <InvalidMessage validateMessage={validateMessage} />
      </div>
    </AutoHeightContainer>
  )
}
ConnectWalletWidget.displayName = "ConnectWalletWidget"
export default ConnectWalletWidget
