const Settings = () => {
  const handleSettingsClick = () => {
    // 处理设置点击事件
    setIsOpen(true);
  };

  return (
    <div 
      className="settings-icon cursor-pointer" 
      onClick={handleSettingsClick}
      role="button"
      tabIndex={0}
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {/* SVG 路径... */}
      </svg>
    </div>
  );
}; 