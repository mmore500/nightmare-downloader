all:
	sudo singularity build nightmare-downloader.simg Singularity

clean:
	rm -f *.simg
