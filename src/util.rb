module I
	module Util

		def Util.to_query(params)
			str = ''
			params.each do |k,param|
				# str = str + "1"
				# str = str + "&="+param.to_s
				str = str + "&"+k.to_s+"="+param.to_s
			end
			str[0] = "?"
			str
		end

	end
end

