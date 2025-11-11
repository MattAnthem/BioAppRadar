import MainLayout from "../../shared/layouts/MainLayout";


const ResponsiveLayout = () => {
  return (
    <MainLayout className="w-full min-h-screen">
      
      <div 
        className={`
          lg:h-full lg:w-full
          lg:px-4 py-2 
          flex flex-col  
          lg:grid lg:grid-rows-[4fr_2fr] gap-2  
        `}
      >

            {/* Top GRID */}
            <div 
              className={`
                lg:h-full lg:w-full 
                lg:row-span-[4fr] row-span-1

                flex flex-col
                lg:grid lg:grid-cols-5 gap-2
              `}
            >

              {/* Map */}
              <div 
                className={`
                  lg:w-full lg:h-full h-[60vh]
                  lg:col-span-4 
                `}
              >

              </div>

              {/* VP chart */}
              <div 
                className={`
                  lg:w-full lg:h-full 
                  lg:col-span-1 
                  bg-green-300
                `}
              >

              </div>

            </div>

            {/* Bottom GRID */}
            <div 
              className={`
                lg:h-full lg:w-full 
                lg:row-span-[2fr] row-span-1

                flex flex-col 
                lg:grid lg:grid-cols-2 gap-2
              `}
            >

              {/* Vtip chart */}
              <div className={`
                lg:w-full lg:h-full
                lg:col-span-1 bg-blue-200
                `}
              >

              </div>

              {/* Vpts Chart */}
              <div className={`
                lg:w-full lg:h-full 
                lg:col-span-1 bg-green-200
                `}
              >

              </div>

            </div>


      </div>

    </MainLayout>
  )
}

export default ResponsiveLayout;
