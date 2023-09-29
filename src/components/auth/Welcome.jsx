const Welcome = (props) => {
  return (
    <section className="section auth">
      <div className="container">
        <h1 className="is-size-2">
          Welcome {props.auth.user.username}!
        </h1>
      </div>
    </section>
  )
}

export default Welcome;
