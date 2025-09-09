import { useRef } from 'react';

interface DataManagerProps {
  onExport: () => boolean;
  onImport: (file: File) => Promise<boolean>;
  onClearAll: () => boolean;
  getStorageInfo: () => { hasData: boolean; lastUpdated?: Date; todoCount?: number };
}

export const DataManager: React.FC<DataManagerProps> = ({
  onExport,
  onImport,
  onClearAll,
  getStorageInfo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageInfo = getStorageInfo();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await onImport(file);
      if (success) {
        alert('データのインポートが完了しました');
      }
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = () => {
    const success = onExport();
    if (success) {
      // ダウンロードが開始されるので特に何もしない
    }
  };

  const handleClearAll = () => {
    if (window.confirm('すべてのデータを削除しますか？この操作は元に戻せません。')) {
      const success = onClearAll();
      if (success) {
        alert('すべてのデータを削除しました');
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="data-manager">
      <h3>📊 データ管理</h3>
      
      <div className="storage-info">
        <div className="info-item">
          <span className="info-label">保存状態:</span>
          <span className={`info-value ${storageInfo.hasData ? 'has-data' : 'no-data'}`}>
            {storageInfo.hasData ? '✅ データあり' : '⭕ データなし'}
          </span>
        </div>
        
        {storageInfo.hasData && storageInfo.todoCount !== undefined && (
          <div className="info-item">
            <span className="info-label">タスク数:</span>
            <span className="info-value">{storageInfo.todoCount} 件</span>
          </div>
        )}
        
        {storageInfo.lastUpdated && (
          <div className="info-item">
            <span className="info-label">最終更新:</span>
            <span className="info-value">{formatDate(storageInfo.lastUpdated)}</span>
          </div>
        )}
      </div>

      <div className="data-actions">
        <button
          className="data-action-btn export-btn"
          onClick={handleExport}
          title="JSONファイルとしてエクスポート"
        >
          📥 エクスポート
        </button>
        
        <button
          className="data-action-btn import-btn"
          onClick={handleImportClick}
          title="JSONファイルからインポート"
        >
          📤 インポート
        </button>
        
        <button
          className="data-action-btn clear-btn"
          onClick={handleClearAll}
          title="すべてのデータを削除"
        >
          🗑️ 全削除
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};