import { useEffect } from 'react'
import { ICommunity } from '../../../../models/Communitty'
import { Badge, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import ProfilePhoto from '../../../../components/ProfilePhoto';
import CONFIG from '../../../../config';
import { useNavigate, useParams } from 'react-router-dom';

interface IProps {
    community: ICommunity;
    setSelected: (data: ICommunity) => void,
    smallScreen?: boolean;
}

function CommunityCard({ community, setSelected, smallScreen = false }: IProps) {
    // const groupPosts = useQuery(['getCommunityPosts', community.id], () => httpService.get(`${GET_GROUP_POSTS}?groupID=${community.id}`), {
    // });
    const params = useParams();
    const nav = useNavigate()

    useEffect(() => {
        if (smallScreen === false) {
            if (community.id === params.id) setSelected(community);
        }
    }, [community, params.id, setSelected, smallScreen])

    const handleSetActive = () => {
        nav(`/communities/community/${community.id}`);
        setSelected(community);
    }


  return (
    <HStack 
    onClick={handleSetActive}
    bg={ !smallScreen &&community.id === params.id ? '#D0D4EB':'white'}
    borderRadius={community.id === params.id ? '20px':'0px'}
    px='10px'
    width='100%' height='100px' justifyContent='space-between' borderBottomWidth={0.5} borderBottomColor='lightgrey' paddingY='4' cursor='pointer'>
        <HStack paddingRight='10px'>
            <ProfilePhoto image={community?.data?.imgSrc === "string" || !community?.data?.imgSrc ? `https://ui-avatars.com/api/?background=random&name=${community?.data?.name}&length=1` : `${CONFIG.RESOURCE_URL}${community?.data?.imgSrc}`} />

            <VStack alignItems='flex-start'>
                <Heading size='sm' as='h4'>{community?.data?.name?.length > 20 ? `${community?.data?.name?.substring(0, 20)}...` : `${community?.data.name}`}</Heading>
                <Text>{community?.data?.description?.length > 20 ? `${community?.data?.description?.substring(0, 20)}...` : community?.data?.description}</Text>
            </VStack>
        </HStack>

        <VStack>
            <Badge colorScheme='blue'>{community.data?.memberCount} Members</Badge>
        </VStack>
    </HStack>
  )
}

export default CommunityCard