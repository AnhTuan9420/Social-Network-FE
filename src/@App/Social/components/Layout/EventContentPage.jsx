import { Box } from '@mui/system'
import PropTypes from 'prop-types'
import React from 'react'
import Left from '../Left'

const EventContentPage = props => {
	const { content, header, maxWidth, chat } = props

	return (
		<Box className='pt-[70px]'>
			{/* {header && <Box className="w-full bg-[#F9F9F9]">{header}</Box>} */}
			<Box className='flex justify-center gap-[100px] w-full'>
				{maxWidth ? null :
					<Box className='w-[20%] sticky top-[70px] h-full'>
						<Left />
					</Box>}
				<Box className={chat ? 'w-[65%]' : 'w-[40%]'}>
					{content}
				</Box>
				{/* <Box className='w-[14%] sticky top-[100px] h-full'>
					<Right />
				</Box> */}
			</Box>
		</Box>
	)
}

EventContentPage.defaultProps = {
	hasBreadcrumb: true,
}

EventContentPage.propTypes = {
	header: PropTypes.any,
	content: PropTypes.any,
	hasBreadcrumb: PropTypes.bool,
	maxWidth: PropTypes.number
}

export default React.memo(EventContentPage)
