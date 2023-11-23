import React from 'react'
import { Link } from 'react-router-dom';
import CONFIG from '../../config';
import { PATH_NAMES } from '../../constants/paths.constant';
import Loader from '../Loader';
import { Badge, Heading, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { ICommunity } from 'src/models/Communitty';
import { FiSearch } from 'react-icons/fi';

interface IProps {
    communities: Array<ICommunity>;
    loading: boolean;
    hasError: boolean;
}

function MyCommunities({ communities, loading, hasError }: IProps) {
  const [search, setSearch] = React.useState('');

  if (loading) {
    return (
      <div className='w-full flex justify-center items-center'>
        <Loader />
      </div>
    )
  }

  if (!loading && hasError) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className='text-4xl'>An error occured</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center pb-16">
                <div className='py-4 flex items-center justify-center gap-4 w-full'>
                    <InputGroup width={['100%', '40%']}>
                      <InputLeftElement>
                        <FiSearch fontSize='20px' />
                      </InputLeftElement>

                      <Input width='100%' type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search by community name' />
                    </InputGroup>
                  </div>
                {communities?.filter((item) => {
                  if (search === '') {
                    return item;
                  } 
                  if (item.data?.name?.toLowerCase().includes(search?.toLowerCase())) {
                    return item;
                  }
                })
                .map(community => (
                  <div
                    key={community.id}
                    className="py-4 flex items-center gap-4 w-full max-w-2xl border-gray-400 border-b-[1px] "
                  >

                   <div className="w-full flex">

                   <div className="border-chasescrollBlue border-l-4 rounded-b-full rounded-tl-full">
                      <Link 
                        to={`${PATH_NAMES.community}/${community.id}`}
                      >
                        <img
                          src={community.data.imgSrc ? `${CONFIG.RESOURCE_URL}/${community.data.imgSrc}` : `https://ui-avatars.com/api/?background=random&name=${community.data.name}&length=1`}
                          alt={community.data.name}
                          className="flex-grow w-[60px] max-w-[px] h-[60px] object-cover border-l-4 border-white rounded-b-full rounded-tl-full"
                        />
                      </Link>
                    </div>
                    <div className="flex justify-between items-center w-full ml-3">

                      <div className="flex flex-col gap-3">
                        <Link to={`${PATH_NAMES.community}/${community.id}`} className="font-medium text-lg md:text-2xl">
                          <Heading size='md'>
                          {community.data.name}
                          </Heading>
                        </Link>
                        <div className="text-sm md:text-base opacity-[50%]">
                          {community.data.description}
                        </div>
                      </div>
                      
                    </div>

                   </div>

                   <Badge colorScheme='blue'>{community.data.memberCount} Member(s)</Badge>

                  </div>
                ))}
    </div>
  )
}

export default MyCommunities