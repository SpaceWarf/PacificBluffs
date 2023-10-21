import './MenusAndAds.scss';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Carousel } from 'react-responsive-carousel';
import Header from '../Common/Header';
import { MenuOrAd, MenuOrAdType } from '../../redux/reducers/menusAndAds';
import { useState } from 'react';

function MenusAndAds() {
  const menusAndAds = useSelector((state: RootState) => state.menusAndAds);
  const [showMenuCopyLabel, setShowMenuCopyLabel] = useState(false);
  const [showAdCopyLabel, setShowAdCopyLabel] = useState(false);

  function handleClickItem(index: number, type: MenuOrAdType) {
    let url;
    if (type === MenuOrAdType.MENU) {
      url = menusAndAds.menus[index].url;
      setShowMenuCopyLabel(true);
      setTimeout(() => { setShowMenuCopyLabel(false); }, 2000);
    } else {
      url = menusAndAds.ads[index].url;
      setShowAdCopyLabel(true);
      setTimeout(() => { setShowAdCopyLabel(false); }, 2000);
    }
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="MenusAndAds">
      <div className='Menus'>
        <Header text='Menus' decorated />
        <Carousel width='500px' infiniteLoop onClickItem={i => handleClickItem(i, MenuOrAdType.MENU)}>
          {menusAndAds.menus.map((item: MenuOrAd) => (
            <div key={item.id} className='Preview'>
              <img src={item.url} alt={item.name} />
              <p className="legend">{item.name}</p>
            </div>
          ))}
        </Carousel>
        {showMenuCopyLabel &&
          <div className="ui left pointing green basic label CopyLabel">
            Copied!
          </div>
        }
      </div>
      <div className='Ads'>
        <Header text='Ads' decorated />
        <Carousel width='500px' infiniteLoop onClickItem={i => handleClickItem(i, MenuOrAdType.AD)}>
          {menusAndAds.ads.map((item: MenuOrAd) => (
            <div key={item.id} className='Preview'>
              <img src={item.url} alt={item.name} />
              <p className="legend">{item.name}</p>
            </div>
          ))}
        </Carousel>
        {showAdCopyLabel &&
          <div className="ui left pointing green basic label CopyLabel">
            Copied!
          </div>
        }
      </div>
    </div>
  );
}

export default MenusAndAds;
