import { Box, Button, CircularProgress, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Yup from '@Core/helper/Yup'
import { useRequest } from 'ahooks'
import { postService } from '@App/Social/services/postService'
import { userService } from '@App/Social/services/userService'
import DataPost from './components/DataPost'
import { useEditProfile } from './hooks/useEditProfile'
import { useCreatePostModal } from '../Facility/hooks/useCreatePostModal'
import { convertDate } from '@Core/helper/Date'
import { getSocialUser } from '@Core/helper/Session'

const Profile = props => {
	let [searchParams] = useSearchParams()
	const user_id = searchParams.get('user_id')
	const user = getSocialUser()
	
	const {
		data: posts,
		run: getPost,
		loading: loadingPost,
		refresh: refreshListPost
	} = useRequest(postService.listPostOfUser, {
		manual: true
	})
	
	const {
		data: profile,
		run: getProfile,
		loading: loadingProfile
	} = useRequest(userService.profile, {
		manual: true
	})
	
	useEffect(() => {
		const params = {
			sortBy: 'createdAt:desc',
		}
		getPost(params, user_id)
		getProfile(user_id)
	}, [user_id])
	
	const { onOpen, render } = useCreatePostModal(refreshListPost)
	const { onOpenEditProfile, renderEditProfile } = useEditProfile(profile, getProfile)

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
		watch
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			email: '',
			password: ''
		},
		resolver: yupResolver(
			Yup.object({
				email: Yup.string()
					.required('Required')
					.email('Error!')
					.min(3, 'Error'),
				password: Yup.string()
					.required('Required')
					.min(8, 'Error')
					.max(20, 'Error')
			})
		)
	})

	return (
		<Box className="w-full pt-[64px] bg-[#f0f2f5]" >
			<Box className="w-full bg-white">
				<Box className='w-[65%] mx-auto bg-white pb-20'>
					<img className='w-full h-[350px] object-cover rounded-b-16' src='/img/bg.jpg' />
					<Box className='flex justify-center mb-[-80px]'>
						<img src={profile?.avatar ?? '/Icons/man.png'} className='rounded-[50%] h-[180px] w-[180px] translate-y-[-50%]' />
					</Box>
					<Box className='text-center'>
						<Typography className='text-36 font-bold'>{profile?.fullName}</Typography>
						<Typography >@{profile?.username}</Typography>
					</Box>
				</Box>
			</Box>

			<Box className="w-[60%] h-auto mx-auto mt-20 px-[28px]">
				<Box className='w-full flex gap-20'>
					<Box className='w-[40%] flex'>
						<Box className='sticky bottom-[20px] self-end w-full'>
							<Box className='bg-[white] p-16 rounded-8' sx={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
								<Typography className='font-bold mb-4'>Giới thiệu</Typography>
								<hr className='text-[#ddc1c1]' />

								<Box className='flex mt-8'>
									<Typography >Học tại </Typography>
									<Typography className='font-bold ml-4'> {profile?.study}</Typography>
								</Box>

								<Box className='flex mt-8'>
									<Typography >Sống tại </Typography>
									<Typography className='font-bold ml-4'> {profile?.liveIn}</Typography>
								</Box>

								<Box className='flex mt-8'>
									<Typography >Làm việc tại </Typography>
									<Typography className='font-bold ml-4'>{profile?.workspace}</Typography>
								</Box>


								<Box className='flex mt-8'>
									<Typography >Số điện thoại </Typography>
									<Typography className='font-bold ml-4'> {profile?.phone}</Typography>
								</Box>

								<Box className='flex mt-8'>
									<Typography >Tham gia vào </Typography>
									<Typography className='font-bold ml-4'> {convertDate(profile?.createdAt)}</Typography>
								</Box>
								{user?.id === user_id ?
									<Button className='w-full mt-8 bg-[#e4e6eb] text-black font-bold' onClick={onOpenEditProfile} >
										Chỉnh sửa thông tin
									</Button>
									: null
								}

							</Box>

							<Box className='bg-[white] p-16 rounded-8 mt-20' sx={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
								<Typography className='font-bold mb-4'>Vị trí hiện tại</Typography>
								<hr className='text-[#ddc1c1]' />
								<iframe className='w-full mt-12' src="https://s.net.vn/RPtP" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
							</Box>

						</Box>
					</Box>

					<Box className='w-[60%]'>
						<Box className='flex items-center mb-20 p-16 bg-[white] rounded-8' sx={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
							<img src='/Icons/man.png' className='h-40 w-40 mr-[30px]' />
							<Typography className='cursor-pointer'
								onClick={onOpen}
							>Bạn có muốn đăng bài không?</Typography>
						</Box>

						<Box className='flex flex-col gap-20 mb-20'>
							{loadingPost ? (
								<div className="my-[15%] flex justify-center items-center">
									<CircularProgress />
								</div>
							) : (
								posts?.results?.map((item, index) => {
									return <DataPost key={index} dataPost={item} refreshListPost={refreshListPost}/>
								})
							)}
						</Box>
					</Box>
				</Box>
			</Box>
			{renderEditProfile()}
			{render()}
		</Box>

	)
}
export default React.memo(Profile)