import {
  BottomList,
  MobileCloudDashboardLayout,
} from "@illa-public/cloud-dashboard-layout"
import { InviteMemberMobile } from "@illa-public/invite-modal"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  getCurrentUserID,
  teamActions,
} from "@illa-public/user-data"
import { canManageInvite, showInviteModal } from "@illa-public/user-role-utils"
import { FC, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { DashBoardDynamicMenu } from "@/page/workspace/components/DynamicMenu"
import { copy } from "@/utils/copy"
import { InviteMenuItem } from "../components/InviteMenuItem"
import { WorkspaceLayoutProps } from "../interface"

export const MobileDashBoardLayout: FC<WorkspaceLayoutProps> = ({
  onOpenChangeLogModal,
}) => {
  const isLogin = useSelector(getCurrentUserID)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  const currentTeamInfo = useSelector(getCurrentTeamInfo)
  const dispatch = useDispatch()
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER

  const handleClickMenuItem = (key: string) => {
    setDrawerVisible(false)
    if (key === "change-log") {
      onOpenChangeLogModal()
    }
  }

  const handleClickInvite = () => {
    setDrawerVisible(false)
    setInviteModalVisible(true)
  }

  return (
    <MobileCloudDashboardLayout
      setDrawerVisible={setDrawerVisible}
      drawerVisible={drawerVisible}
      bottomComponent={
        <BottomList
          onClickMenuItemCallback={handleClickMenuItem}
          extBottomComponent={
            showInviteModal(currentTeamInfo) && (
              <InviteMenuItem onClickInvite={handleClickInvite} />
            )
          }
        />
      }
      dynamicMenu={
        <div>
          <DashBoardDynamicMenu
            onClickMenuItemCallback={() => {
              setDrawerVisible(false)
            }}
          />
        </div>
      }
    >
      {isLogin && <Outlet />}
      {inviteModalVisible && (
        <InviteMemberMobile
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
    </MobileCloudDashboardLayout>
  )
}
