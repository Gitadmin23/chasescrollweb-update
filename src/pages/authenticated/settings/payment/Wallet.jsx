import React, { useEffect, useState } from 'react'
import Toggle from 'react-toggle'
import PageWrapper from '@/components/PageWrapper'
import { Link } from 'react-router-dom'
import { ChevronLeft, MiniTicketIcon } from '@/components/Svgs'
import { PATH_NAMES } from '@/constants/paths.constant'
import CONFIG from '@/config'
import { useAuth } from '@/context/authContext'
import { useFetch } from '@/hooks/useFetch'
import { GET_USER_PRIVATE_PROFILE } from '@/constants/endpoints.constant'
import { ClosedEyeIcon, OpenEyeIcon, CashoutIcon, FundWalletIcon } from '@/components/Svgs'
import { GET_WALLET_BALANCE, WITHDRAW_FROM_WALLET, FUND_WALLET, GET_TRANSACTIONS } from '@/constants/endpoints.constant'
import { CURRENCY } from '@/constants'
import { formatNumber } from '@/utils/helpers'
import ButtonSpinner from '@/components/ButtonSpinners'
import PaymentRecord from '@/components/settings/PaymentRecord'
import PaymentType from './PaymentType'
import Stripecomponent from '@/components/explore/Stripecomponent/Stripecomponent'
import CashOutBtn from './CashOutBtn'
import UserImages from '@/components/exploreComponents/sharedComponent/userImages'

const Wallet = () => {
	const { USD, NGN } = CURRENCY

	const [profile, setProfile] = useState({})
	const [transactions, setTransactions] = useState([])
	const [currency, setCurrency] = useState(USD)
	const [showEscrow, setShowEscrow] = useState(true)
	const [showBalance, setShowBalance] = useState(false)
	const [loading, setLoading] = useState(false)
	const [amount, setAmount] = useState()
	const [view, setView] = useState("fund")
	const [showStripeForm, setShowStripeForm] = useState(false)
	const [walletBalance, setWalletBalance] = useState({
		walletBalances: {
			currency,
			balance: 0
		},
		escrowBalances: {
			currency,
			balance: 0
		}
	})

	const { token } = useAuth()
	const { sendRequest: sendPaystackRequest, isLoading } = useFetch()
	const { sendRequest } = useFetch()
	const [configStripe , setConfigStripe] = React.useState({ }) 
	const [clientKey , setClientKey] = React.useState("")  

	const [userInfo , setUserInfo] = React.useState({})  

	const [config , setConfig] = React.useState( { 
	  email: "",
	  amount: 0,
	  reference: "",
	  publicKey: "pk_test_58a8e726bbe3cce8ade3082f4e49f46089046b5d",
	}) 

	const getProfile = () => {
		sendRequest(
			GET_USER_PRIVATE_PROFILE,
			"GET",
			null,

			{ Authorization: `Bearer ${token}` }
		).then(data => setProfile(data))
	}

	const getWalletBalance = () => {
		sendRequest(
			`${GET_WALLET_BALANCE}?currency=${currency}`,
			"GET",
			null,
			{ Authorization: `Bearer ${token}` }
		).then(data => {
			setWalletBalance(data)})
	} 

	const topUpWallet = () => {
		sendRequest(
			FUND_WALLET,
			"POST",
			{
				currency,
				amount,
				transactionGateway: "PAYSTACK"
			},
			{ Authorization: `Bearer ${token}` }
		).then(response => window.open(response?.checkout, "_blank"))
	}

	const withdrawFromWallet = () => {
		sendRequest(
			`${WITHDRAW_FROM_WALLET}?currency=${currency}&amount=${amount}`,
			"POST",
			null,
			{ Authorization: `Bearer ${token}` }
		).then(response => window.open(response?.checkout, "_blank"))
	}

	const getWalletTransactions = () => {
		sendRequest(
			`${GET_TRANSACTIONS}`,
			"GET",
			null,
			{ Authorization: `Bearer ${token}` }
		).then((response) =>{

		console.log(response);
		 setTransactions(response?.content)})
	} 
	 
	const closeModal =()=> {
		setShowStripeForm(false)
	}

	const payWithPaystack = async() => { 
		setLoading(true)

		sendPaystackRequest(
		  "/payments/api/wallet/fundWalletWeb",
		  "POST",
		  {
			"currency": currency,
			"amount": amount
		  },
		  { Authorization: `Bearer ${token}` }
		).then((data) => {
			console.log(data);

			if(data?.totalAmount > 0){
				if(currency === "USD"){ 
					setConfigStripe({
						reference: data?.transactionID,
						amount: data?.totalAmount
					}) 
					setClientKey(data?.clientSecret)
					setShowStripeForm(true) 
				} else {
				setConfig({ 
					email: profile?.email,
					amount: (Number(data?.totalAmount)), //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
					publicKey: 'pk_test_58a8e726bbe3cce8ade3082f4e49f46089046b5d',
					reference: data?.transactionID
				}); 
				} 
			}
		}) 
		setLoading(false)
	}   
	const toggleView = () => setShowEscrow(state => !state)
	const toggleCurrency = () => setCurrency(state => state === NGN ? USD : NGN)
	const toggleBalanceVisibility = () => setShowBalance(state => !state)

	useEffect(() => {
		getProfile()
		getWalletTransactions()
	}, [])

	useEffect(() => {
		getWalletBalance()
	}, [currency])

	return (
		<PageWrapper>
			{() => (
				<div className="pt-4 px-4 lg:px-28 pb-24 w-full flex flex-col gap-12">
					<div className="flex justify-between">
						<Link to={PATH_NAMES.payments} className="flex gap-6 items-center">
							<ChevronLeft />
							<div className="flex gap-4 items-center">
								{/* <img
									src={`${CONFIG.RESOURCE_URL}${profile?.data?.imgMain?.value}`}
									alt={`${profile}'s profile avatar`}
									className="w-12 h-12 rounded-full object-cover border border-chasescrollBlue"
								/> */}

								<UserImages data={profile} size={"12"} font={"28px"} />
								<div className="flex flex-col text-sm">
									<span className="text-gray-800">Hello</span>
									<span className="font-bold capitalize">{profile?.firstName} {profile?.lastName}</span>
								</div>
							</div>
						</Link>
						<div className="flex items-center gap-2">
							<span className="text-chasescrollTextGrey font-semibold">Currency switch</span>
							<Toggle
								checked={currency === NGN}
								className="wallet-custom-classname"
								onChange={toggleCurrency}
								icons={{
									checked: <span className='text-white font-bold'>₦</span>,
									unchecked: <span className='text-white font-bold'>$</span>,
								}}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2 w-full max-w-sm self-center">
						<div className="w-full self-center flex flex-col gap-6 bg-chasescrollDarkBlue rounded-lg h-52 p-1">
							<div className="flex justify-between rounded-t-md">
								<button className="font-semibold px-2 py-0.5 bg-white text-chasescrollDarkBlue rounded-tl-md rounded-br-lg">Balance</button>
								{showEscrow ? (
									<button className="flex gap-1 items-center px-2 rounded-md bg-white text-chasescrollDarkBlue" onClick={toggleView}>
										<span className='text-2xl'>&lsaquo;</span>
										<span className='font-semibold'>Wallet</span>
									</button>
								) : (
									<button className="flex gap-1 items-center px-2 text-white" onClick={toggleView}>
										<span className='font-semibold'>Escrow</span>
										<span className='text-2xl'>&rsaquo;</span>
									</button>
								)}
							</div>
							<div className="self-center flex flex-col gap-2 w-full max-w-fit min-w-[140px]">
								<div className="flex justify-between items-center text-white">
									<span className="text-base">Total</span>
									<button onClick={toggleBalanceVisibility}>
										{!showBalance ? <ClosedEyeIcon /> : <OpenEyeIcon />}
									</button>
								</div>
								{showEscrow ? (
									<h1 className="text-white font-bold text-2xl text-center flex items-center justify-center">
										{isLoading
											? <ButtonSpinner />
											: showBalance
												? formatNumber((walletBalance?.walletBalances?.balance/100), currency === USD ? "$" : "₦")
												: `${currency} * * * *`
										}
									</h1>
									): (
										<h1 className="text-[#F29339] font-bold text-2xl text-center flex items-center justify-center">
											{isLoading
												? <ButtonSpinner />
												: showBalance
													? formatNumber((walletBalance?.escrowBalances?.balance/100), currency === USD ? "$" : "₦")
													: `${currency} * * * *`
											}
										</h1>
									)
								}
							</div>
						</div>
						<div className="flex text-center gap-4 rounded-md bg-white p-1 w-full max-w-sm self-center border border-chasescrollButtonBlue">
							<Link
								to={PATH_NAMES.events}
								className="basis-1/4 p-2"
							>
								<div className="flex flex-col items-center gap-2">
									<div className="w-12 h-10 flex justify-center items-center rounded-full border border-chasescrollDarkBlue">
										<MiniTicketIcon />
									</div>
									<span className="text-chasescrollDarkBlue text-[10px] text-center">Buy Ticket</span>
								</div>
							</Link>
							<div className={`flex flex-col items-center gap-2 basis-1/4 p-2 ${!showEscrow ?  "opacity-25 cursor-not-allowed" : "cursor-pointer "}  rounded-md ${view === "cash" ? "bg-chasescrollDarkBlue border-white text-white" : "border-chasescrollDarkBlue text-chasescrollDarkBlue bg-white"}`}>
								<button disabled={!showEscrow ? true : false} onClick={() => setView("cash")} className={`w-12 h-10 flex justify-center ${!showEscrow ?  "opacity-25 cursor-not-allowed" : "cursor-pointer "} items-center rounded-full border ${view === "cash" ? "border-white" : "border-chasescrollDarkBlue"}`}>
									<CashoutIcon />
								</button>
								<span className={`text-chasescrollDarkBlue text-[10px] text-center ${view === "cash" ? "text-white" : "text-chasescrollDarkBlue"}`}>Cash Out</span>
							</div>
							<div className={`flex flex-col items-center gap-2 basis-1/4 p-2 cursor-pointer rounded-md ${view === "fund" ? "bg-chasescrollDarkBlue border-white text-white" : "border-chasescrollDarkBlue text-chasescrollDarkBlue bg-white"}`}>
								<div onClick={() => setView("fund")} className={`w-12 h-10 flex justify-center items-center rounded-full border ${view === "fund" ? "border-white" : "border-chasescrollDarkBlue"}`}>
									<FundWalletIcon />
								</div>
								<span className={`text-chasescrollDarkBlue text-[10px] text-center ${view === "fund" ? "text-white" : "text-chasescrollDarkBlue"}`}>Fund Wallet</span>
							</div>
							<div className={`flex flex-col items-center gap-2 basis-1/4 p-2 cursor-pointer rounded-md ${view === "history" ? "bg-chasescrollDarkBlue border-white text-white" : "border-chasescrollDarkBlue text-chasescrollDarkBlue bg-white"}`}>
								<div onClick={() => setView("history")} className={`w-12 h-10 flex justify-center items-center rounded-full border ${view === "history" ? "border-white" : "border-chasescrollDarkBlue"}`}>
									<MiniTicketIcon />
								</div>
								<span className={`text-chasescrollDarkBlue text-[10px] text-center ${view === "history" ? "text-white" : "text-chasescrollDarkBlue"}`}>History</span>
							</div>
						</div>
						{view === "fund" && (
							<div className="flex flex-col gap-2">
								<p className="text-center text-xl">Enter Amount</p>
								<input
									type="number"
									value={amount}
									onChange={({ target: { value } }) => setAmount(value)}
									className="text-center p-3 text-chasescrollTextGrey text-2xl outline-none bg-transparent w-full"
									placeholder={`${currency === USD ? '$' : '₦'} 100`}
								/>
								<button disabled={!loading ? false :amount ? false  : true} onClick={payWithPaystack} className={` ${amount ? " ": "  bg-opacity-25 "} bg-chasescrollDarkBlue text-white text-base rounded-lg p-2.5`}>{loading ? "Loading..": "Fund"}</button>
							</div>
						)}
						{view === "history" && (
							<div className="flex flex-col pt-7 gap-4 w-full ">
								{transactions?.map(transaction => {
									console.log(transaction);
									return(
										<PaymentRecord
											key={transaction?.transactionID}
											{...transaction}
										/>
									)
								})}
							</div>
						)}
						{view === "cash" && (
							<div className="flex flex-col gap-2">
								<p className="text-center text-xl">Enter Amount</p>
								<input
									type="number"
									value={amount}
									onChange={({ target: { value } }) => setAmount(value)}
									className="text-center p-3 text-chasescrollTextGrey text-2xl outline-none bg-transparent w-full"
									placeholder={`${currency === USD ? '$' : '₦'} 100`}
								/>
								<CashOutBtn amount={amount} currency={currency} getData={getWalletBalance} />
							</div>
						)}
					</div>
						<PaymentType config={config}  getData={getWalletBalance} setConfig={setConfig} />

						{showStripeForm && (
							<Stripecomponent fund={true} clientKey={clientKey} config={configStripe} closeModal={closeModal} getData={getWalletBalance}  />
						)}
					{/* {config?.reference && (
					)} */}
				</div>
			)}
		</PageWrapper>
	)
}

export default Wallet