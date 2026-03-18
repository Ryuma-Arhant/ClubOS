export default function Orbs() {
  return (
    <>
      <div style={{position:'absolute',width:800,height:800,borderRadius:'50%',background:'rgba(245,197,24,0.055)',filter:'blur(160px)',top:-300,left:-200,pointerEvents:'none',zIndex:0}} />
      <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',background:'rgba(217,119,6,0.04)',filter:'blur(130px)',bottom:-150,right:-150,pointerEvents:'none',zIndex:0}} />
      <div style={{position:'absolute',width:350,height:350,borderRadius:'50%',background:'rgba(245,197,24,0.025)',filter:'blur(90px)',top:'45%',right:'15%',pointerEvents:'none',zIndex:0}} />
    </>
  );
}
