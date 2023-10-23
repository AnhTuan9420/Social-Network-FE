import { userService } from '@App/Social/services/userService'
import CoreInput from '@Core/components/Input/CoreInput'
import { errorMsg, successMsg } from '@Core/helper/Message'
import Yup from '@Core/helper/Yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Typography } from '@mui/material'
import { useBoolean } from 'ahooks'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export const useEditProfile = (profile, getProfile) => {
	const [open, { setTrue, setFalse }] = useBoolean()

	const {
		control,
		handleSubmit,
		setValue,
		formState: { isSubmitting },
		watch
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			fullName: '',
			study: '',
			liveIn: '',
			phone: '',
			workspace: ''
		},
		resolver: yupResolver(
			Yup.object({
				fullName: Yup.string()
					.required('Required')
					.min(8, 'Full Name must be between 8 and 20 characters')
					.max(20, 'Full Name must be between 8 and 20 characters'),
			})
		)
	})

	const [selectedFile, setSelectedFile] = useState()
	const [preview, setPreview] = useState()

	useEffect(() => {
		if (!selectedFile) {
			setPreview(undefined)
			return
		}

		const objectUrl = URL.createObjectURL(selectedFile)
		setPreview(objectUrl)

		return () => URL.revokeObjectURL(objectUrl)
	}, [selectedFile])

	const onSelectFile = e => {
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedFile(undefined)
			return
		}

		setSelectedFile(e.target.files[0])
	}

	const handleClose = () => {
		setPreview(undefined)
		setSelectedFile(undefined)
	}

	useEffect(() => {
		setValue('fullName', profile?.fullName)
		setValue('study', profile?.study)
		setValue('liveIn', profile?.liveIn)
		setValue('phone', profile?.phone)
		setValue('workspace', profile?.workspace)
	}, [profile])

	const onSubmit = handleSubmit(async data => {
		try {
			await userService.updateProfile(data)
			successMsg('Update profile success.')
			setFalse()
			getProfile(profile?.id)
		} catch (error) {
			errorMsg(error.response.data.message)
		}
	})

	const renderEditProfile = useCallback(() => {
		return (
			<Dialog
				onClose={setFalse}
				open={open}
				maxWidth="md"
				fullWidth
				PaperProps={{
					style: {
						borderRadius: '8px',
						maxWidth: '700px'
					}
				}}
			>
				<form onSubmit={onSubmit}>
					<DialogTitle className="p-16">
						<Box className="flex items-center">
							<IconButton onClick={() => setFalse()} className="p-0">
								<CloseOutlinedIcon color="error" />
							</IconButton>
							<Typography className="mx-auto sm:text-[26px] text-16 font-semibold text-[#222222] leading-[140%]">
								Chỉnh sửa thông tin chi tiết
							</Typography>
						</Box>
					</DialogTitle>
					<Divider />

					<DialogContent className="p-0">
						<Box className="p-16 h-auto">
							<Typography className="text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-semibold">
								Ảnh đại diện
							</Typography>
							<Box className='mb-16'>
								<Box>
									{selectedFile && preview ?
										<Box className='flex items-start'>
											<Box className='w-[180px] h-[180px] mx-auto'>
												<img className=' object-cover w-full h-full rounded-[50%]' src={preview} />
											</Box>
											<IconButton onClick={() => handleClose()} className="p-0">
												<CloseOutlinedIcon color="error" />
											</IconButton>
										</Box>
										:
										<Box className='w-[180px] h-[180px] mx-auto'>
											<img className=' object-cover w-full h-full rounded-[50%]' src='/Icons/man.png' />
										</Box>
									}
								</Box>
								<input type='file' onChange={onSelectFile} />
							</Box>

							<Typography className="text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-semibold">
								Tên
							</Typography>
							<CoreInput
								control={control}
								name="fullName"
								className="w-full mb-8"
								placeholder={'Nhập tên của bạn '}
								inputLogin={true}
							/>

							<Typography className="text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-semibold">
								Trường học
							</Typography>
							<CoreInput
								control={control}
								name="study"
								className="w-full mb-8"
								placeholder={'Nhập trường học'}
								inputLogin={true}
							/>

							<Typography className="text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-semibold">
								Nơi sống
							</Typography>
							<CoreInput
								control={control}
								name="liveIn"
								className="w-full mb-8"
								placeholder={'Nhập nơi sống'}
								inputLogin={true}
							/>

							<Typography className="text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-semibold">
								Nơi làm việc
							</Typography>
							<CoreInput
								control={control}
								name="workspace"
								className="w-full mb-8"
								placeholder={'Nhập nơi làm việc'}
								inputLogin={true}
							/>

							<Typography className="text-16 text-[#222222] sm:leading-[160%] leading-[140%] font-semibold">
								Số điện thoại
							</Typography>
							<CoreInput
								control={control}
								name="phone"
								className="w-full mb-8"
								placeholder={'Nhập số điện thoại'}
								inputLogin={true}
							/>

						</Box>
					</DialogContent>
					<Divider />

					<DialogActions>
						<Box className='text-center p-8 flex justify-between w-full'>
							<Button
								variant="contained"
								className="bg-[#e4e6eb] shadow-none font-bold text-[black]"
								onClick={() => setFalse()}
							>
								Hủy
							</Button>
							<Button
								variant="contained"
								type='submit'
								className="bg-[red] shadow-none font-semibold text-[#FFFFFF]"
							>
								Cập nhật
							</Button>
						</Box>
					</DialogActions>
				</form>
			</Dialog>
		)
	},
		[open, selectedFile, preview, profile, setTrue]
	)

	return { onOpenEditProfile: setTrue, renderEditProfile }
}
