import Form from "../Form/Form"
import Posts from "../Posts/Posts"

const Home = () => {
  return (
    <>
      <div className='app-body'>        
        <div className='posts'>
          <Posts />
        </div>
        <Form />
      </div> 
    </>
  )
}

export default Home
