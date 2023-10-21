import headerDecoration from '../../assets/images/header-decoration.png';

interface HeaderProps {
  text: string;
  contrast?: boolean;
  decorated?: boolean;
}

function Header({ text, contrast, decorated }: HeaderProps) {
  return (
    <div className='Header'>
      {decorated && (
        <div>
          <img className='HeaderDecoration left' src={headerDecoration} alt='Header Decoration'></img>
        </div>
      )}
      <h1 className={`ui header ${contrast ? 'contrast' : ''}`}>{text}</h1>
      {decorated && (
        <div>
          <img className='HeaderDecoration right' src={headerDecoration} alt='Header Decoration'></img>
        </div>
      )}
    </div>
  );
}

export default Header;