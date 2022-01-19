interface HelloProps {
  msg: string;
}

const Hello = (props: HelloProps) => {
  return (
    <h1>{props.msg}</h1>
  )
}

export default Hello
