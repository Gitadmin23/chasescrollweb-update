import { HStack, VStack, Skeleton, Heading, Box, Text, Input, InputGroup, InputRightElement, Image, Spinner, Flex } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query';
import { AddIcon } from '../../../../components/Svgs';
import { PATH_NAMES } from '../../../../constants/paths.constant';
import { ICommunity } from '../../../../models/Communitty';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { Link, useParams } from 'react-router-dom'
import CommunityCard from '../shared/CommunityCard';
import CommunityHeader from '../shared/CommunityHeader';
import { FiCalendar, FiImage, FiSend } from 'react-icons/fi'
import { COLORS } from '../../../../utils/colors';
import httpService from '../../../../utils/httpService';
import { CREATE_POST, GET_GROUP_POSTS, GET_SAVED_EVENTS, SAVE_EVENT, UPLOAD_IMAGE } from '../../../../constants/endpoints.constant';
import { IEvent } from '../../../../models/Events';
import EventsToAdd from '../../../../components/communities/EventsToAdd';
import { toast } from 'react-toastify';
import EventsPanel from '../shared/EventsPanel';
import { IMediaContent } from 'src/models/MediaPost';
import MessagePanel from '../shared/MessagePanel';
import CONFIG from '../../../../config';
import selector from "../../../../assets/svg/image.svg"
import smiley from "../../../../assets/svg/smiley.svg"
import addEventBtn from "../../../../assets/svg/add-event.svg"
import send from "../../../../assets/svg/send-icon.svg"

interface IProps {
    query: UseQueryResult<AxiosResponse<PaginatedResponse<ICommunity>, PaginatedResponse<ICommunity>>>;
}

function DesktopViewChat({ query }: IProps) {
    const [communities, setCommunities] = useState<Array<ICommunity>>([]);
    const [activeCommunity, setActiveCommuntiy] = useState<ICommunity | null>(null);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [messages, setMessages] = useState<IMediaContent[]>([]);
    const [image, setImage] = useState('');
    const [post, setPost] = useState('');    

    // refs
    const filePickerRef = useRef<HTMLInputElement>();
    const fileReader = useRef<FileReader>(new FileReader());

    // effect
    useEffect(() => {
        const ref = fileReader.current;
        fileReader.current.onload = () => {
            setImage(fileReader.current.result as string);
            console.log(fileReader.current.result);
        }
        return () => ref.removeEventListener('load', () => {
            console.log(`removed`);
        });
    }, [])

    // react-query
    const queryClient = useQueryClient();

    // queries
    const getSavedEvents = useQuery(['getSavedEvent', activeCommunity?.id], () => httpService.get(`${GET_SAVED_EVENTS}?typeID=${activeCommunity?.id}&type=GROUP`), {
        onSuccess: (data) => {
            const response: PaginatedResponse<IEvent> = data.data;
            setEvents(response.content);
        }
    });

    const getMessages = useQuery(['getMessages', activeCommunity?.id], () => httpService.get(`${GET_GROUP_POSTS}?groupID=${activeCommunity?.id}`), {
        onSuccess: (data) => {
            const response: PaginatedResponse<IMediaContent> = data.data;
            setMessages(response.content);
        }
    });

    // mutations
    const addNewEvent = useMutation({
        mutationFn: (data: string) => httpService.post(`${SAVE_EVENT}`, {
            eventID: data,
            typeID: activeCommunity?.id,
            type: "GROUP"
        }),
        onSuccess: () => {
            toast.success("Event added");
            queryClient.invalidateQueries(['getSavedEvent']);
        }
    });

    const uploadImage = useMutation({
        mutationFn: (data: FormData) => httpService.post(`${UPLOAD_IMAGE}/${activeCommunity?.id}`, data),
        onSuccess: (data) => {
            console.log(data.data);
            toast.success("Image uploaded");
            setImage(data.data.fileName);
        }
    });

    const imagePost = useMutation({
        mutationFn: () => httpService.post(`${CREATE_POST}`, {
            text: post,
            mediaRef: image,
            multipleMediaRef: [
              image,
            ],
            sourceId: activeCommunity?.id,
            type: "WITH_IMAGE"
        }),
        onError: (error) => {
            toast.error(`An error occured`);
        },
        onSuccess: (data) => {
            console.log(data.data)
            toast.success("Post created");
            queryClient.invalidateQueries(['getMessages']);
            setImage('');
            setPost('');
            document.querySelector('#v')?.scrollTo(0, document.querySelector('#v')?.scrollHeight as number);
        }
    });

    const Post = useMutation({
        mutationFn: () => httpService.post(`${CREATE_POST}`, {
            text: post, type: "NO_IMAGE_POST", sourceId: activeCommunity?.id 
        }),
        onError: (error) => {
            toast.error(`An error occured`);
        },
        onSuccess: (data) => {
            toast.success("Post created");
            queryClient.invalidateQueries(['getMessages']);
            setImage('');
            setPost('');
            document.querySelector('#v')?.scrollTo(0, document.querySelector('#v')?.scrollHeight as number);
        }
    });


    useEffect(() => {
        if (query.isLoading) return;
        if (communities.length < 1) {
            setCommunities(query.data?.data.content as Array<ICommunity>);
        } else {
            // communities.unshift(...query.data?.data.content as Array<ICommunity>);
            // setCommunities(communities);
        }
    }, [communities, communities.length, query.data?.data.content, query.isLoading]);

    // functions
    const toggleEvents = () => setShowEventModal(state => !state);
    const openPicker = useCallback(() => {
        filePickerRef.current?.click();
    }, []);

    const handleFilePicked = useCallback((file: FileList) => {
        fileReader.current.readAsDataURL(file[0]);

        // upload the image
        const formData = new FormData();
        formData.append('file', file[0]);
        uploadImage.mutate(formData);
    }, [uploadImage]);

    const handlePost = useCallback(() => {
        if (Post.isLoading || imagePost.isLoading) return;
        if (post === '') {
            toast.warn("Please enter a post");
            return;
        }
        if (image === '') {
            // make normal post
            Post.mutate();
        } else {
            imagePost.mutate();
        }
    }, [Post, image, imagePost, post])

    if (showEventModal) {
          {/* EVENTS TO ADD MODAL */}
        return (
            <EventsToAdd
                addEvent={addNewEvent.mutate}
                toggleEvents={toggleEvents}
            />
        )
    }

    return (
        <HStack width='100%' height='100%' gap={0}>

            {/* HIDDEN FILE PICKER */}
            <input className='hidden' type='file' accept='image/*' ref={filePickerRef} onChange={(e) => handleFilePicked(e.target.files as FileList)} />
          
            {/* SIDE PANEL */}
            <VStack flex='0.3' bg='white' height='100%' shadow='md' zIndex={3}>
                {/* HEADER */}

                <HStack justifyContent='space-between' alignItems='center' width='100%' height='60px' px='20px'>
                    <Heading color='brand.chasescrollButtonBlue'>Communities</Heading>
                    <Link
                        to={PATH_NAMES.createGroup}
                        className="text-chasescrollPurple"
                    >
                        <AddIcon />
                    </Link>
                </HStack>

                {/* HANDLE LOADING STATE */}
                {query.isLoading && (
                    <VStack width='100%' px='20px'>
                        <Skeleton height='100px' width='100%' marginBottom='10px' />
                        <Skeleton height='100px' width='100%' marginBottom='10px' />
                        <Skeleton height='100px' width='100%' marginBottom='10px' />
                        <Skeleton height='100px' width='100%' marginBottom='10px' />
                        <Skeleton height='100px' width='100%' marginBottom='10px' />
                        <Skeleton height='100px' width='100%' marginBottom='10px' />
                    </VStack>
                )}
                <VStack flex={1} overflow='auto' width='100%' px='20px'>
                    {!query.isLoading && communities.map((community, i) => (
                        <CommunityCard community={community} key={i} setSelected={(data: ICommunity) => setActiveCommuntiy(data)} />
                    ))}
                </VStack>
            </VStack>

            {/* CHAT AREA */}
            <VStack flex='0.7' height='100%' spacing={0} zIndex={1} className='bg-[url("/src/assets/images/chat-bg.png")]'>
                {activeCommunity === null && (
                    <VStack width='100%' height='100%' justifyContent='center' alignItems='center'>
                        <Heading color='brand.chasescrollButtonBlue' size='md'>No community Selected</Heading>
                    </VStack>
                )}
                {activeCommunity !== null && (
                    <VStack flex='1' width='100%' height='100%' spacing={0}>
                        <CommunityHeader community={activeCommunity as ICommunity} setActive={setActiveCommuntiy} />
                        

                        {/* DESCRRIPTION AND MESSAGE AREA */}
                        <Flex flexDirection='column' flex='1' overflow={'auto'} width='100%' height='auto' paddingBottom='100px'  >
                            {events.length > 0 && (
                                 <Box width='100%' height='120px'>
                                    <EventsPanel communityId={activeCommunity.id} events={events} toggleEvents={toggleEvents} />
                                </Box>
                            )}
                            <HStack width='100%' height='50px' justifyContent='center' paddingX='50px' marginTop='10px'>
                                {events.length < 1 && (
                                    <Image onClick={() => setShowEventModal(true)} src={addEventBtn} width='40px' height='40px' cursor='pointer' />
                                )}
                                <HStack justifyContent='center' flex={1} marginX='20px' >
                                    <Text fontSize='xs' width='60%' color='grey' textAlign={'center'}>{activeCommunity.data.description}</Text>
                                </HStack>
                            </HStack>
                            <Box flex='1' height='100%' width='100%' >
                                <MessagePanel messages={messages} isLoading={getMessages.isLoading} />
                            </Box>

                            <Box height='100px' />
                        </Flex>


                        {/* INPUT FIELD AREAD */}
                        <HStack width='100%' height='70px' alignItems='flex-start' px='20px'>
                            <span className='cursor-pointer mt-3'>
                                <Image src={selector} width='30px' height='30px' onClick={openPicker} />
                            </span>
                            {
                                uploadImage.isLoading && (
                                    <Spinner colorScheme='blue' size='md' />
                                )
                            }
                            { !uploadImage.isLoading && image !== '' && (
                                <Image src={`${CONFIG.RESOURCE_URL}/${image}`} width='60px' height='60px' borderRadius='10px' />
                            )}
                            <InputGroup>
                                <InputRightElement marginRight='10px' marginTop='6px'>
                                    { !Post.isLoading && !imagePost.isLoading && <Image src={send} width='30px' height='30px' onClick={handlePost} /> }
                                    { Post.isLoading || imagePost.isLoading && <Spinner colorScheme='blue' size='md' />}
                                </InputRightElement>
                                <Input value={post} onChange={(e) => setPost(e.target.value)} onKeyDown={(e) => { e.key === 'Enter' && handlePost()}} placeholder='Say something...' flex='1' bg="white" height='55px' borderRadius='20px' />
                            </InputGroup>
                        </HStack>
                    </VStack>
                )}
            </VStack>
        </HStack>
    )
}

export default DesktopViewChat