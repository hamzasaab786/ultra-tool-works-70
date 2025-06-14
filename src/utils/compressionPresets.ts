import { CompressionSettings } from './pdfCompression';

export interface CompressionPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: CompressionSettings;
  estimatedReduction: string;
  bestFor: string[];
}

export const COMPRESSION_PRESETS: CompressionPreset[] = [
  {
    id: 'web',
    name: 'Web Optimized',
    description: 'Balanced compression perfect for web sharing and email',
    icon: 'Globe',
    settings: {
      level: 'medium',
      removeMetadata: true,
      optimizeImages: true,
      flattenForms: false,
      removeUnusedObjects: true,
      imageQuality: 85,
      downscaleImages: true,
      maxImageDimension: 1200
    },
    estimatedReduction: '30-50%',
    bestFor: ['Email attachments', 'Web uploads', 'Quick sharing']
  },
  {
    id: 'print',
    name: 'Print Quality',
    description: 'Minimal compression maintaining high quality for printing',
    icon: 'Printer',
    settings: {
      level: 'low',
      removeMetadata: false,
      optimizeImages: false,
      flattenForms: false,
      removeUnusedObjects: true,
      imageQuality: 95,
      downscaleImages: false,
      maxImageDimension: 2400
    },
    estimatedReduction: '10-20%',
    bestFor: ['Professional printing', 'High-quality documents', 'Archives']
  },
  {
    id: 'mobile',
    name: 'Mobile Friendly',
    description: 'Aggressive compression for mobile viewing and sharing',
    icon: 'Smartphone',
    settings: {
      level: 'high',
      removeMetadata: true,
      optimizeImages: true,
      flattenForms: true,
      removeUnusedObjects: true,
      imageQuality: 65,
      downscaleImages: true,
      maxImageDimension: 720
    },
    estimatedReduction: '60-80%',
    bestFor: ['Mobile apps', 'Slow connections', 'Storage saving']
  },
  {
    id: 'archive',
    name: 'Archive Storage',
    description: 'Maximum compression for long-term storage',
    icon: 'Archive',
    settings: {
      level: 'maximum',
      removeMetadata: true,
      optimizeImages: true,
      flattenForms: true,
      removeUnusedObjects: true,
      imageQuality: 50,
      downscaleImages: true,
      maxImageDimension: 600
    },
    estimatedReduction: '70-90%',
    bestFor: ['Long-term storage', 'Backup archives', 'Space optimization']
  },
  {
    id: 'custom',
    name: 'Custom Settings',
    description: 'Configure all compression options manually',
    icon: 'Settings',
    settings: {
      level: 'medium',
      removeMetadata: true,
      optimizeImages: true,
      flattenForms: false,
      removeUnusedObjects: true,
      imageQuality: 85,
      downscaleImages: true,
      maxImageDimension: 1200
    },
    estimatedReduction: 'Variable',
    bestFor: ['Specific requirements', 'Advanced users', 'Fine-tuning']
  }
];

export const getPresetById = (id: string): CompressionPreset | undefined => {
  return COMPRESSION_PRESETS.find(preset => preset.id === id);
};

export const getCompressionLevelDescription = (level: string): string => {
  switch (level) {
    case 'low':
      return 'Minimal compression preserving maximum quality and all features';
    case 'medium':
      return 'Balanced compression with good quality retention and moderate size reduction';
    case 'high':
      return 'Strong compression with noticeable size reduction, some quality trade-offs';
    case 'maximum':
      return 'Aggressive compression prioritizing maximum space savings';
    default:
      return '';
  }
};
