import { useState } from 'react'
import PageWrapper from '../../../components/PageWrapper'
import { useAuth } from "../../../context/authContext"
import { GET_JOINED_GROUPS } from "../../../constants/endpoints.constant"
import Share from "../home/Share"
import DesktopViewChat from "./DesktopView"
import { useQuery } from "react-query"
import httpService from "../../../utils/httpService";
import MobileViewChat from "./MobileView"

const Community = () => {
	const [showShareModal, setShowShareModal] = useState(false)
	const toggleShare = () => setShowShareModal(state => !state)
	const { userId } = useAuth()

	// react-query
	const getJoinGroups = useQuery(['getJoinedGroups', userId], () => httpService.get(`${GET_JOINED_GROUPS}?userID=${userId}`));

	return (
		<>
			{showShareModal && <Share closeShareModal={toggleShare} />}
			<PageWrapper>
				{() => (
					<>
					{/* BIG SCREEN CHAT */}
					<div className="hidden lg:block xl:block w-full h-full">
						<DesktopViewChat query={getJoinGroups} />
					</div>

					{/* SMALL SCREENS */}
					<div className="block lg:hdden xl:hidden w-full h-full">
						<MobileViewChat query={getJoinGroups} />
					</div>
					</>
				)}
			</PageWrapper>
		</>
	)
}

export default Community