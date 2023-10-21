import logo from '../../assets/images/logo.png';

interface LogoProps {
  interactive?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function Logo({ interactive, onClick, onMouseEnter, onMouseLeave }: LogoProps) {
  return (
    interactive ? (
      <div
        className='Logo interactive'
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <img src={logo} alt='Logo' />
      </div>
    ) : (
      <div className='Logo' >
        <img src={logo} alt='Logo' />
      </div>
    )
  );
}

export default Logo;
