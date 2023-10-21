interface ClockedInLabelProps {
  clockedIn: boolean;
  contrast?: boolean;
}

function ClockedInLabel({ clockedIn, contrast }: ClockedInLabelProps) {
  return clockedIn ? (
    <div className='ClockedInLabel'>
      <div className='Indicator positive'></div>
      <p className={`${contrast ? 'contrast' : ''}`}>Clocked In</p>
    </div>
  ) : (
    <div className='ClockedInLabel'>
      <div className='Indicator negative'></div>
      <p className={`${contrast ? 'contrast' : ''}`}>Clocked Out</p>
    </div>
  )
}

export default ClockedInLabel;