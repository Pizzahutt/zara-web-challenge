import type { ProductSpecs as ProductSpecsType } from '@/lib/types';

interface ProductSpecsProps {
  specs: ProductSpecsType;
  brand: string;
  name: string;
  description: string;
}

const SPEC_LABELS: Record<string, string> = {
  brand: 'Brand',
  name: 'Name',
  description: 'Description',
  screen: 'Screen',
  resolution: 'Resolution',
  processor: 'Processor',
  mainCamera: 'Main Camera',
  selfieCamera: 'Selfie Camera',
  battery: 'Battery',
  os: 'OS',
  screenRefreshRate: 'Screen Refresh Rate',
};

export default function ProductSpecs({
  specs,
  brand,
  name,
  description,
}: ProductSpecsProps) {
  const rows = [
    { label: 'brand', value: brand },
    { label: 'name', value: name },
    { label: 'description', value: description },
    { label: 'screen', value: specs.screen },
    { label: 'resolution', value: specs.resolution },
    { label: 'processor', value: specs.processor },
    { label: 'mainCamera', value: specs.mainCamera },
    { label: 'selfieCamera', value: specs.selfieCamera },
    { label: 'battery', value: specs.battery },
    { label: 'os', value: specs.os },
    { label: 'screenRefreshRate', value: specs.screenRefreshRate },
  ];

  return (
    <section className="flex flex-col gap-10">
      <h2 className="font-light text-xl capitalize">Specifications</h2>
      <dl className="flex flex-col">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`flex gap-6 md:gap-12 py-4 border-b-[0.5px] border-black font-light text-sm ${
              index === 0 ? 'border-t-[0.5px]' : ''
            }`}
          >
            <dt className="uppercase w-[120px] md:w-[300px] shrink-0">
              {SPEC_LABELS[row.label]}
            </dt>
            <dd className="flex-1 min-w-0">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
