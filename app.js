
let provider, signer, contract, userAddress;
const CONTRACT_ADDRESS = "0x570053837ced3c7e64006B8Cdd8E8468d186f049";
const USDT_ADDRESS = "0x0000000000000000000000000000000000000000"; // your USDT token here
const ABI = [ /* ABI HERE */ ];

async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask not detected");
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  document.getElementById("wallet").innerText = userAddress;
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  fetchBalances();
}

async function fetchBalances() {
  const zentra = await contract.balanceOf(userAddress);
  document.getElementById("zentraBalance").innerText = ethers.utils.formatUnits(zentra, 18);
  const usdt = new ethers.Contract(USDT_ADDRESS, [
    { "constant": true, "inputs": [{"name":"_owner","type":"address"}], "name":"balanceOf", "outputs": [{"name":"balance","type":"uint256"}], "type":"function" }
  ], provider);
  const usdtBal = await usdt.balanceOf(userAddress);
  document.getElementById("usdtBalance").innerText = ethers.utils.formatUnits(usdtBal, 18);
}

async function mint() {
  const amt = document.getElementById("mintAmount").value;
  const tx = await contract.mintWithUSDT(userAddress, ethers.utils.parseUnits(amt, 18));
  await tx.wait();
  fetchBalances();
}

async function stake() {
  const amt = document.getElementById("stakeAmount").value;
  const tx = await contract.stake(ethers.utils.parseUnits(amt, 18));
  await tx.wait();
  fetchBalances();
}

async function buyBond() {
  const type = document.getElementById("bondType").value;
  const days = document.getElementById("bondDays").value;
  const amt = document.getElementById("bondAmount").value;
  const tx = await contract.buyBond(type, days, ethers.utils.parseUnits(amt, 18));
  await tx.wait();
  fetchBalances();
}

async function claimBond() {
  const id = document.getElementById("bondId").value;
  const tx = await contract.claimBond(id);
  await tx.wait();
}
