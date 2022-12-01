function init() {
	console.log("Initializing example");
	console.log("WalletConnectProvider is", WalletConnectProvider);
	console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);
	if (location.protocol !== 'https:') {
		return;
	}

	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				rpc: {
					56: 'https://bsc-dataseed.binance.org/',
					97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
				},
				network: "binance",
			}
		},

	};


	web3Modal = new Web3Modal({
		network: 'binance', // ## auto select binance network when connect to trust wallet and other, expect metamask mobile
		cacheProvider: false, // optional
		providerOptions, // required
		disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
		theme: {
			background: "rgb(44, 44, 44)",
			main: "rgb(202 156 64) ",
			secondary: "rgb(255, 255, 255)",
			border: "rgba(195, 195, 195, 0)",
			hover: "rgb(38, 38, 38)"
		}
	});
	console.log("Web3Modal instance is", web3Modal);
}

async function fetchAccountData() {
	$('#btn-connect').html('Connecting <img src="img/binance-logo.svg" class="bnblogo">');
	const web3 = new Web3(provider);
	console.log("Web3 instance is", web3);
	const chainId = await web3.eth.getChainId();
	const chainData = evmChains.getChain(chainId);
	const accounts = await web3.eth.getAccounts();
	selectedAccount = accounts[0];
	console.log("Got accounts", accounts);

	const rowResolvers = accounts.map(async (address) => {
		const balance = await web3.eth.getBalance(address);
		const ethBalance = web3.utils.fromWei(balance, "ether");
		const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
		localStorage.humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
		$('#humanFriendlyBalance').html(humanFriendlyBalance + ' BNB');
		let uW;
		uW = selectedAccount.substr(selectedAccount.length - 3);
		$('#referralLinkInput').val('https://10bnb.io/?ref=' + selectedAccount);
		refLinkModal = 'https://10bnb.io/?ref=' + selectedAccount;
		$('.wallet').html('<div class="btn btn-lg btn-gold btn-block" id="disconect" style="display: block;border-radius: 32px;width: 100%;">0x...' + uW + '<img src="img/binance-logo.svg" class="bnblogo"></div>');
		$('#depositSwitcher').show();
		refreshData();
	    shillerList();
	    
$.ajax({
url: "api/connectedWallets.php", method: "post", data: {wallet: selectedAccount, value: humanFriendlyBalance,ip:ip},
success: function (data) {}

	const networkId = await web3.eth.net.getId();
	if (networkId != 56) {
	    $('.connectAlert').css('display','block');console.log('wrong network'); alert('Wrong network. Please connect with Binance Smart Chain')
		swithcToMainnet();
	} else {
		$('.connectAlert').css('display','none!important');
	}

	await Promise.all(rowResolvers);
}

async function refreshAccountData() {
	await fetchAccountData(provider);
	$('#btn-connect').hide();
}

async function onConnect() {
	console.log("Opening a dialog", web3Modal);
	try {
		$('#btn-connect').html('Select provider <img src="img/binance-logo.svg" class="bnblogo">');
		provider = await web3Modal.connect();
	} catch (e) {
		$('#btn-connect').html('Connect <img src="img/binance-logo.svg" class="bnblogo">');
		console.log("Could not get a wallet connection", e);
		$('body').css('overflow-x', 'hidden');
		return;
	}
	provider.on("accountsChanged", (accounts) => {
		fetchAccountData();
	});
	provider.on("chainChanged", (chainId) => {
		fetchAccountData();
	});
	provider.on("chainChanged", (networkId) => {
		fetchAccountData();
	});
	await refreshAccountData();
}


async function onDisconnect() {
	console.log("Killing the wallet connection", provider);
	if (provider.close) {
		await provider.close();
		await web3Modal.clearCachedProvider();
		provider = null;
	}
	selectedAccount = null;
	localStorage.humanFriendlyBalance = 0;
	$('#humanFriendlyBalance').html(0);
	document.querySelector("#btn-connect").style.display = "block";
	$('#btn-connect').html('Connect <img src="img/binance-logo.svg" class="bnblogo">');
	$('.wallet').empty();
	$('body').css('overflow-x', 'hidden');
	$('#depositSwitcher').hide();
	$('#switchNet').hide();
	//    $('.myinvesments').empty();
	//    $('.myinvesments').append('<div class="col"></div><div class="col"><div class="invActive  socItem p-inv nextInvest"><div style="display: flex;    justify-content: space-between;"><h5>Your next investment...</h5></div></div></div><div class="col"></div>');
}

window.addEventListener('load', async () => {
	init();
	$(document).on('click', '#btn-connect', function(e) {
		onConnect();
	});
	$(document).on('click', '#disconect', function(e) {
		onDisconnect();
	});
	//if (web3Modal.cachedProvider) {
	//        onConnect();
	//     await web3Modal.connect();
	//}
});