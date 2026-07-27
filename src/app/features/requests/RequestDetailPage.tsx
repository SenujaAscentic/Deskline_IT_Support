import { useParams } from "react-router-dom";
import { requests } from "./data";
import { RequestDetail } from "./RequestDetail";

export function RequestDetailPage() {
  const {id}= useParams();
  const request = requests.find((r)=>r.id===id);
  
  if(!request){
    return <p>Request not found.</p>
  }

  return (
    <section>
      <h2>Request Detail</h2>
      <RequestDetail request={request} />
    </section>
  );
}