import logo from '../../assets/images/logo.png';

interface LogoProps {
  interactive?: boolean;
  onClick?: () => void;
}

function Logo({ interactive, onClick }: LogoProps) {
  return (
    interactive ? (
      <div
        className='Logo interactive'
        onClick={onClick}
      >
        <img className='LogoIcon' src={logo} alt='Logo' />
      </div>
    ) : (
      <div className='Logo' >
        <img className='LogoIcon' src={logo} alt='Logo' />
      </div>
    )
  );
}

export default Logo;
