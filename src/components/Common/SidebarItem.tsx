interface SidebarItemProps {
  name: string;
  icon: string;
  image?: string;
  path?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function SidebarItem({ name, icon, image, path, onClick, children }: SidebarItemProps) {
  function handleMouseEnter() {
    const iconEl = document.getElementsByClassName(`${icon} icon`);
    iconEl[0].classList.add('BounceSideways');
  }

  function handleAnimationEnd() {
    const iconEl = document.getElementsByClassName(`${icon} icon`);
    iconEl[0].classList.remove('BounceSideways');
  }

  function isActive() {
    return path ? window.location.href.split('/')[3] === path.split('/')[1] : false;
  }

  return (
    <div
      className={`SidebarItem ${isActive() ? 'active' : ''}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="Label">
        {!image && <i className={`${icon} icon`}></i>}
        {image && <img className={`${icon} icon`} src={image} alt="Profile" />}
        <span>{name}</span>
      </div>
      {children}
    </div>
  );
}

export default SidebarItem;