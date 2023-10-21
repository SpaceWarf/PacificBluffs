interface LinkCardProps {
  title: string;
  description: string;
  icon: string;
}

function StatsCard({ title, description, icon }: LinkCardProps) {
  return (
    <div className='ui card StatsCard'>
      <div className='content'>
        {icon === 'tip' ? (
          <div className="TipIcon">
            <i className="dollar icon"></i>
            <i className="heart icon"></i>
          </div>
        ) : (
          <i className={`icon ${icon}`}></i>
        )}
        <div className='Label'>
          <p className='Title'>{title}</p>
          <p className='Description'>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default StatsCard;