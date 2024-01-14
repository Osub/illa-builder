import UploadWidgetIcon from "@/assets/widgetCover/upload.svg?react"
import i18n from "@/i18n/config"
import { RESIZE_DIRECTION, WidgetConfig } from "@/widgetLibrary/interface"

export const CONNECT_WALLET_WIDGET_CONFIG: WidgetConfig = {
  displayName: "connect_wallet",
  widgetName: i18n.t("widget.connect.wallet.name"),
  h: 5,
  w: 6,
  type: "CONNECT_WALLET_WIDGET",
  icon: <UploadWidgetIcon />,
  keywords: ["Connect wallet Input", "连接钱包"],
  sessionType: "WEB3",
  resizeDirection: RESIZE_DIRECTION.HORIZONTAL,
  version: 0,
  defaults: {
    type: "button",
    buttonText: i18n.t("widget.upload.default_button_text"),
    selectionType: "single",
    dropText: i18n.t("widget.upload.default_dropzone_text"),
    verticalAlign: "center",
    hidden: false,
    appendFiles: false,
    fileType: "",
    variant: "fill",
    colorScheme: "blue",
    formDataKey: "upload",
    showFileList: false,
    sizeType: "mb",
    dynamicHeight: "auto",
  },
}
