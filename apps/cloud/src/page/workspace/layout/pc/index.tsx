import { PCCloudDashBoardLayout } from "@illa-public/cloud-dashboard-layout"
import { BottomList } from "@illa-public/cloud-dashboard-layout/components/BottomList"
import { InviteMemberPC } from "@illa-public/invite-modal"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import {
  currentUserActions,
  getCurrentTeamInfo,
  getCurrentUserID,
  getIsTutorialViewed,
  getPlanUtils,
  teamActions,
} from "@illa-public/user-data"
import {
  ACTION_MANAGE,
  ATTRIBUTE_GROUP,
  canManage,
  canManageInvite,
  showInviteModal, // openInviteModal,
} from "@illa-public/user-role-utils"
import { getAuthToken, getILLABuilderURL } from "@illa-public/utils"
import { FC, Suspense, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { useModal } from "@illa-design/react"
import { FullSectionLoading } from "@/components/FullSectionLoading"
import { DashBoardDynamicMenu } from "@/page/workspace/components/DynamicMenu"
import { updateTutorialViewed } from "@/services/user"
import { copy } from "@/utils/copy"
import { InviteMenuItem } from "../components/InviteMenuItem"
import { WorkspaceLayoutProps } from "../interface"

// import { DashboardContentHeader } from "@/page/workspace/components/DashboardContentHeader"
// import { useUpgradeModal } from "@illa-public/upgrade-modal"

export const PCDashBoardLayout: FC<WorkspaceLayoutProps> = ({
  onOpenChangeLogModal,
}) => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!!
  const isLogin = useSelector(getCurrentUserID)
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER
  const dispatch = useDispatch()
  const isTutorialViewed = useSelector(getIsTutorialViewed)
  const teamPlan = getPlanUtils(currentTeamInfo)
  const modal = useModal()
  const { t } = useTranslation()
  const guideOpened = useRef(false)
  const { teamIdentifier } = useParams()
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  // const navigate = useNavigate()
  // const upgradeModal = useUpgradeModal()
  // const [showInvite, setShowInvite] = useState(false)
  const canEditApp = canManage(
    currentUserRole,
    ATTRIBUTE_GROUP.APP,
    teamPlan,
    ACTION_MANAGE.EDIT_APP,
  )

  // const canCreateAgent = canManage(
  //     currentTeamInfo.myRole,
  //     ATTRIBUTE_GROUP.AI_AGENT,
  //     getPlanUtils(currentTeamInfo),
  //     ACTION_MANAGE.CREATE_AI_AGENT,
  // )

  const handleClickMenuItem = (key: string) => {
    if (key === "change-log") {
      onOpenChangeLogModal()
    }
  }

  const handleClickInvite = () => {
    setInviteModalVisible(true)
  }

  // const handleCreateAgent = useCallback(() => {
  //   // track(
  //   //     ILLA_MIXPANEL_EVENT_TYPE.CLICK,
  //   //     ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_DASHBOARD,
  //   //     {
  //   //       element: "create_new_app",
  //   //     },
  //   // )
  //   navigate(`/${currentTeamInfo.identifier}/ai-agent`)
  // }, [navigate, currentTeamInfo.identifier])

  // const handleInviteAgent = useCallback(() => {
  //   // track(
  //   //     ILLA_MIXPANEL_EVENT_TYPE.CLICK,
  //   //     ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_DASHBOARD,
  //   //     {
  //   //       element: "invite",
  //   //     },
  //   // )
  //   if (!openInviteModal(currentTeamInfo)) {
  //     upgradeModal({
  //       modalType: "upgrade",
  //       from: "",
  //     })
  //     return
  //   }
  //   setShowInvite(true)
  // }, [currentTeamInfo, upgradeModal])

  useEffect(() => {
    if (
      !isTutorialViewed &&
      canEditApp &&
      !guideOpened.current &&
      teamIdentifier
    ) {
      guideOpened.current = true
      modal.show({
        id: "openGuide",
        title: t("tutorial.modal.tutorial.first_time.title"),
        children: t("tutorial.modal.tutorial.first_time.description"),
        cancelText: t("tutorial.modal.tutorial.first_time.cancel"),
        okText: t("tutorial.modal.tutorial.first_time.take"),
        okButtonProps: {
          colorScheme: "techPurple",
        },
        onOk: () => {
          window.open(
            `${getILLABuilderURL()}/${teamIdentifier}/guide?token=${getAuthToken()}`,
          )
        },
        afterOpen: () => {
          dispatch(currentUserActions.updateUserIsTutorialViewedReducer(true))
          try {
            updateTutorialViewed(true)
          } catch (_ignore) {}
        },
      })
    }
  }, [canEditApp, dispatch, isTutorialViewed, modal, t, teamIdentifier])

  return (
    <PCCloudDashBoardLayout
      dynamicMenu={
        <div>
          {/*<DashboardContentHeader*/}
          {/*    icon={currentTeamInfo.icon}*/}
          {/*    name={currentTeamInfo.name}*/}
          {/*    onCreate={handleCreateAgent}*/}
          {/*    onInvite={handleInviteAgent}*/}
          {/*    canCreate={canCreateAgent}*/}
          {/*    isCreateLoading={false}*/}
          {/*/>*/}
          <DashBoardDynamicMenu />
        </div>
      }
      bottomComponent={
        <BottomList
          extBottomComponent={
            showInviteModal(currentTeamInfo) && (
              <InviteMenuItem onClickInvite={handleClickInvite} />
            )
          }
          onClickMenuItemCallback={handleClickMenuItem}
        />
      }
    >
      {isLogin && (
        <Suspense fallback={<FullSectionLoading />}>
          <Outlet />
        </Suspense>
      )}
      {inviteModalVisible && (
        <InviteMemberPC
          itemID={currentTeamInfo!.id}
          redirectURL=""
          onClose={() => setInviteModalVisible(false)}
          canInvite={canManageInvite(
            currentTeamInfo!.myRole,
            currentTeamInfo!.permission.allowEditorManageTeamMember,
            currentTeamInfo!.permission.allowViewerManageTeamMember,
          )}
          currentUserRole={currentUserRole}
          defaultAllowInviteLink={currentTeamInfo!.permission.inviteLinkEnabled}
          defaultInviteUserRole={USER_ROLE.VIEWER}
          defaultBalance={currentTeamInfo?.currentTeamLicense?.balance ?? 0}
          onCopyInviteLink={copy}
          onInviteLinkStateChange={(isInviteLink) => {
            dispatch(
              teamActions.updateTeamMemberPermissionReducer({
                teamID: currentTeamInfo!.id,
                newPermission: {
                  ...currentTeamInfo!.permission,
                  inviteLinkEnabled: isInviteLink,
                },
              }),
            )
          }}
          teamID={currentTeamInfo!.id}
          onBalanceChange={(balance) => {
            dispatch(
              teamActions.updateTeamMemberSubscribeReducer({
                teamID: currentTeamInfo!.id,
                subscribeInfo: {
                  ...currentTeamInfo!.currentTeamLicense,
                  balance: balance,
                },
              }),
            )
          }}
          onInvitedChange={(userList) => {
            const memberListInfo: MemberInfo[] = userList.map((user) => {
              return {
                ...user,
                userID: "",
                nickname: "",
                avatar: "",
                userStatus: USER_STATUS.PENDING,
                permission: {},
                createdAt: "",
                updatedAt: "",
              }
            })
            dispatch(teamActions.updateInvitedUserReducer(memberListInfo))
          }}
        />
      )}
    </PCCloudDashBoardLayout>
  )
}
