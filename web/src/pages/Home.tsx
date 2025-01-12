import { Centered } from "../components/Centered"

type TechnologiesType = { name: string, logo: string, url: string }

const technologies = [
  { name: 'Vite', logo: 'i-logos:vitejs', url: 'https://vitejs.dev/guide/why.html' },
  { name: 'React', logo: 'i-devicon:react', url: 'https://reactjs.org/' },
  { name: 'TypeScript', logo: 'i-logos:typescript-icon', url: 'https://www.typescriptlang.org/' },
  { name: 'Wouter', logo: 'i-wouter', url: 'https://github.com/molefrog/Wouter' },
  { name: 'daisyUI', logo: 'i-daisyui', url: 'https://daisyui.com/' },
  { name: 'TailwindCSS', logo: 'i-logos:tailwindcss-icon', url: 'https://tailwindcss.com/docs/installation' },
  { name: 'UnoCSS', logo: 'i-vscode-icons:file-type-unocss', url: 'https://unocss.dev/' },
  { name: 'Iconify', logo: 'i-line-md:iconify2', url: 'https://iconify.design/' },
  // { name: 'Jotai', logo: 'i-jotai', url: 'https://jotai.org/' },
]

const techDiv = (tech: TechnologiesType) => (
  <div key={tech.name} className='logo min-w-100px min-h-100px max-w-148px max-h-148px w-10vw h-10vw aspect-square m-2'>
    <div className={"flex flex-col w-full h-full rounded-2xl"}>
      <span className={` flex-grow w-full h-full text-5xl ${tech.logo}`} />
      <span className='mt-10px text-lg self-center select-none'>{tech.name}</span>
    </div>
  </div>
)

const ITEM_SPACING = '';

export default function Home() {
  return (
      <>
        {/* <div className="grid grid-cols-[repeat(4,minmax(100px,1fr))]">
          {technologies.map(tech => techDiv(tech))}
        </div> */}
        <Centered>
          <div className="flex flex-col w-5/6 border border-neutral-300 rounded-2xl p-4">
            {/* Item 1 */}
            <Centered>
              <div className="w-full flex items-center justify-between px-4 py-2">
                {/* Label */}
                <span className={`${ITEM_SPACING}`}>Traditional DNS</span>

                <div className="w-1/2 flex items-center gap-2 justify-between">
                  {/* Badge */}
                  <div className={`${ITEM_SPACING} badge badge-success w-20 text-center`}>
                    success
                  </div>

                  {/* Button */}
                  <button className={`${ITEM_SPACING} btn btn-neutral w-1/6`}>Test</button>
                </div>
              </div>
            </Centered> 

            {/* Item 2 */}
            <Centered>
            <div className="w-full flex items-center justify-between px-4 py-2">
            {/* Label */}
                <span className={`${ITEM_SPACING}`}>DNS over HTTPS (DoH)</span>

                <div className="w-1/2 flex items-center gap-2 justify-between">
                  {/* Badge */}
                  <div className={`${ITEM_SPACING} badge badge-error w-20 text-center`}>
                    failed
                  </div>

                  {/* Button */}
                  <button className={`${ITEM_SPACING} btn btn-neutral w-1/6`}>Retry</button>
                </div>
              </div>
            </Centered> 

            {/* Item 3 */}
            <Centered>
            <div className="w-full flex items-center justify-between px-4 py-2">
            {/* Label */}
                <span className={`${ITEM_SPACING}`}>DNS over TLS (DoT)</span>

                <div className="w-1/2 flex items-center gap-2 justify-between">
                  {/* Badge */}
                  <div className={`${ITEM_SPACING} badge badge-warning w-20 text-center`}>
                    processing
                  </div>

                  {/* Button */}
                  <button className={`${ITEM_SPACING} btn btn-neutral w-1/6`}>Cancel</button>
                </div>
              </div>
            </Centered> 
          </div>
        </Centered>
      </>
  )
}
